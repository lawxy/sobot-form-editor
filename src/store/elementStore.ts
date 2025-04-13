import { arrayMoveImmutable } from 'array-move';
import { cloneDeep } from 'lodash-es';
import { runInAction } from 'mobx';
import { idCreator, bindFromCopiedElement, unBindFromElement } from '@/utils';
import { tabStore } from './tabStore';
import eventStore from './eventStore';
import type { IBaseElement } from '../types';
import { IBaseStore, IElementStore } from './types';
import baseStore from '.';

export default {
  /**
   * 表单元素集合
   */
  formElements: [],

  formElementMap: new Map(),

  traceActions: [],

  tracePointer: 0,

  // 是否需要追踪
  tracing: true,

  addTraceAction(action: { undo: () => any; redo: () => any }) {
    if (!this.tracing) return;

    if (this.traceActions.length === 0) {
      this.traceActions.push({ redo: action.redo });
      this.traceActions.push({ undo: action.undo });
      this.tracePointer = 2;
    } else {
      const currentAction = this.traceActions[this.tracePointer - 1] || {};
      // 当前指针添加恢复功能
      currentAction.redo = action.redo;
      this.traceActions[this.tracePointer - 1] = currentAction;

      this.traceActions.length = ++this.tracePointer;
      // 新指针添加撤回功能
      this.traceActions[this.tracePointer - 1] = { undo: action.undo };
    }

    // this.traceActions.length = ++this.tracePointer;

    // this.tracePointer = this.traceActions.length;
  },

  async undo() {
    this.tracing = false;
    const action = this.traceActions[this.tracePointer - 1];
    action?.undo?.();
    this.tracePointer--;
    this.tracing = true;
  },

  async redo() {
    this.tracing = false;
    const action = this.traceActions[this.tracePointer - 1];
    action?.redo?.();
    this.tracePointer++;
    this.tracing = true;
  },

  flatElement(el: IBaseElement) {
    runInAction(() => {
      this.formElementMap.set(el.id!, el);
    });
  },

  setFormElements(els: IBaseElement[]) {
    this.formElements = els;
  },

  clearAllElements() {
    this.formElements = [];
    this.formElementMap.clear();
  },

  /**
   * 通过id获取元素
   */
  getElement(id?: string) {
    if (!id) return;

    return this.formElementMap.get(id);
  },

  /**
   * 通过id获取父元素的子元素列表
   */
  getParentChildren(id?: string) {
    const parent = this.getElement(id);
    if (parent) {
      if (!parent.children) parent.children = [];
      return parent.children;
    }
    return this.formElements;
  },

  /**
   * 新增元素
   */
  appendEl(el: IBaseElement, selectNewElement = true) {
    const parentChildren = this.getParentChildren(el.parentId);
    parentChildren.push(el);
    if (selectNewElement) {
      this.setSelectedElement(el);
    }

    this.formElementMap.set(el.id!, el);

    this.addTraceAction({
      undo: () => {
        this.deleteEl(el);
      },
      redo: () => {
        this.appendEl(el, selectNewElement);
      },
    });
  },

  /**
   * 插入元素
   */
  insertEl(el: IBaseElement, idx: number) {
    const parentChildren = this.getParentChildren(el.parentId);

    parentChildren.splice(idx, 0, el);
    this.formElementMap.set(el.id!, el);
    this.setSelectedElement(el);

    this.addTraceAction({
      undo: () => {
        this.deleteEl(el);
      },
      redo: () => {
        this.insertEl(el, idx);
      },
    });
  },

  /**
   * 移动元素
   */
  // moveEl(parentId: string, fromIndex: number, toIndex: number) {
  //   const el = this.getElement(parentId);
  //   const parentChildren = this.getParentChildren(parentId);
  //   const afterSort = arrayMoveImmutable(parentChildren, fromIndex, toIndex);
  //   if (!el) {
  //     this.formElements = afterSort;
  //   } else {
  //     this.setElementProp(parentId, 'children', afterSort);
  //   }
  // },

  /**
   * 移动元素
   */
  moveElInSameParent(parentId: string, fromIndex: number, toIndex: number) {
    const el = this.getElement(parentId);
    const parentChildren = this.getParentChildren(parentId);
    const afterSort = arrayMoveImmutable(parentChildren, fromIndex, toIndex);
    if (!el) {
      this.formElements = afterSort;
    } else {
      this.setElementProp(parentId, 'children', afterSort);
    }

    this.addTraceAction({
      undo: () => {
        this.moveElInSameParent(parentId, toIndex, fromIndex);
      },
      redo: () => {
        console.log('????');
        this.moveElInSameParent(parentId, fromIndex, toIndex);
      },
    });
  },

  async moveElInDifferentParent(
    htmlElement: HTMLElement,
    oldParentId: string,
    newParentId: string,
    oldIndex: number,
    newIndex: number,
  ) {
    this.tracing = false;
    const current = this.getElement(htmlElement.dataset.id);
    await this.deleteEl(current, true);
    htmlElement.setAttribute('data-parent-id', newParentId);
    const newEl = {
      ...current,
      parentId: newParentId,
    };
    this.formElementMap.set(htmlElement.dataset.id!, newEl);
    this.insertEl(newEl, newIndex!);
    this.tracing = true;

    this.addTraceAction({
      undo: () => {
        this.moveElInDifferentParent(
          htmlElement,
          newParentId,
          oldParentId,
          newIndex,
          oldIndex,
        );
      },
      redo: () => {
        this.moveElInDifferentParent(
          htmlElement,
          oldParentId,
          newParentId,
          oldIndex,
          newIndex,
        );
      },
    });
  },

  dfsEl(el, callback, containParent) {
    if (containParent) callback(el);
    if (el?.children?.length) {
      el.children.forEach((child) => {
        this.dfsEl(child, callback, true);
      });
    }
  },

  /**
   * 删除元素
   */
  async deleteEl(el?: IBaseElement, move?: boolean) {
    if (!el) return false;

    const parentChildren = this.getParentChildren(el.parentId);

    const idx = parentChildren.findIndex((item) => item.id === el.id);
    // 容器间的移动会删除原有元素 但是绑定的服务和事件不变
    if (!move) {
      const confirmDelete = await eventStore.deleteId(el.id!);
      if (!confirmDelete) return false;
      this.dfsEl(
        el,
        (child) => {
          unBindFromElement(child.id!);
        },
        true,
      );
    }

    this.dfsEl(el, (child) => {
      this.formElementMap.delete(child.id!);
    });

    this.formElementMap.delete(el.id!);
    runInAction(() => {
      parentChildren.splice(idx, 1);
    });

    const formValues = baseStore.fieldValues;
    delete formValues[el.id!];
    baseStore.setFieldsValues(formValues);

    this.addTraceAction({
      undo: () => {
        this.insertEl(el, idx);
      },
      redo: () => {
        this.deleteEl(el, move);
      },
    });

    return true;
  },

  /**
   * 复制元素
   */
  copyEl(el: IBaseElement): IBaseElement {
    const parentChildren = this.getParentChildren(el.parentId);

    const idx = parentChildren.findIndex((item) => item.id === el.id);

    const newId = idCreator(el.type);

    const newEl: IBaseElement = { ...cloneDeep(el), id: newId };

    // 复制的事件源id修改
    newEl?.events?.forEach((event) => {
      event.id = idCreator('event');
      const { eventTargets } = event;
      eventTargets?.forEach((target) => {
        target.sourceId = newId;
        target.id = idCreator('event-target');
      });
    });

    this.formElementMap.set(newId, newEl);
    // 关联服务相关设置
    bindFromCopiedElement(el.id as string, newId);

    // 容器组件中的子组件递归操作
    if (el?.children?.length) {
      const children: IBaseElement[] = [];
      el.children.forEach((child: IBaseElement) => {
        const newChild = { ...cloneDeep(child), parentId: newId };
        children.push(this.copyEl(newChild));
      });
      newEl.children = children;
    }

    parentChildren.splice(idx + 1, 0, newEl);

    baseStore.setFieldValue(newEl.id!, baseStore.fieldValues[el.id!]);

    this.addTraceAction({
      undo: () => {
        this.deleteEl(newEl);
      },
      redo: () => {
        this.copyEl(el);
      },
    });

    return newEl;
  },

  /**
   * 当前选中的元素
   */
  selectedElement: {},

  setSelectedElement(el: IBaseElement) {
    this.selectedElement = el;
    tabStore.init();
  },

  setElementProp<T extends keyof IBaseElement>(
    id: string,
    field: T,
    value: IBaseElement[T],
  ) {
    const element = this.getElement(id);
    element![field] = value;
  },

  /**
   * 设置当前选中元素属性
   */
  setSelectedProp<T extends keyof IBaseElement>(
    field: T,
    value: IBaseElement[T],
  ) {
    this.setElementProp(this.selectedElement.id!, field, value);
    this.selectedElement[field] = value;
  },
} as Pick<IBaseStore, keyof IElementStore>;
