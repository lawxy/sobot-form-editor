import { arrayMoveImmutable } from 'array-move';
import { cloneDeep } from 'lodash-es';
import { runInAction } from 'mobx';
import { idCreator, bindFromCopiedElement, unBindFromElement } from '@/utils';
import { tabStore } from './tabStore';
import eventRelationStore from './eventRelationStore';
import type { IBaseElement, TElementSearch } from '../types';
import { IBaseStore, IElementStore } from './types';
// import baseStore from '.';

export default {
  /**
   * 表单元素集合
   */
  formElements: [],

  formElementMap: new Map(),

  deleteElementMap: new Map(),

  traceActions: [],

  tracePointer: 0,

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
  },

  async undo() {
    this.tracing = false;
    const action = this.traceActions[this.tracePointer - 1];
    await action?.undo?.();
    runInAction(() => {
      this.tracePointer--;
      this.tracing = true;
    });
  },

  async redo() {
    this.tracing = false;
    const action = this.traceActions[this.tracePointer - 1];
    await action?.redo?.();
    runInAction(() => {
      this.tracePointer++;
      this.tracing = true;
    });
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
  getElement(search?: TElementSearch) {
    if (!search) return null;

    if (typeof search === 'string') {
      return this.formElementMap.get(search);
    }

    if (!search?.id && !search?.fieldName) return null;

    if (search?.fieldName) {
      return Array.from(this.formElementMap.values()).find(
        (element) => element.fieldName === search.fieldName,
      );
    }
    if (search?.id) {
      return this.formElementMap.get(search?.id);
    }
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
      undo: async () => {
        await this.deleteEl(el);
      },
      redo: () => {
        const deletedEl = this.deleteElementMap.get(el.id!);
        if (deletedEl) {
          this.appendEl(deletedEl, selectNewElement);
        }
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
      undo: async () => {
        await this.deleteEl(el);
      },
      redo: async () => {
        const deletedEl = this.deleteElementMap.get(el.id!);
        if (deletedEl) {
          await this.insertEl(deletedEl, idx);
        }
      },
    });
  },

  /**
   * 移动元素
   */
  moveElInSameParent(parentId: string, fromIndex: number, toIndex: number) {
    console.log('fromIndex', fromIndex)
    console.log('toIndex', toIndex)
    const el = this.getElement(parentId);
    const parentChildren = this.getParentChildren(parentId);
    const afterSort = arrayMoveImmutable(parentChildren, fromIndex, toIndex);
    if (!el) {
      this.formElements = afterSort;
    } else {
      this.setElementProp(parentId, 'children', afterSort);
    }

    this.addTraceAction({
      undo: async () => {
        await this.moveElInSameParent(parentId, toIndex, fromIndex);
      },
      redo: async () => {
        await this.moveElInSameParent(parentId, fromIndex, toIndex);
      },
    });
  },

  async moveElInDifferentParent(
    htmlElement: HTMLElement,
    newParentId: string,
    newIndex: number,
    fromHuman?: boolean,
  ) {
    // console.log('htmlElement', htmlElement)
    this.tracing = false;

    const current = this.getElement(htmlElement.dataset.id)!;
    const oldParentId = current.parentId;

    const oldParent = this.getParentChildren(oldParentId);

    const oldIndex = oldParent.findIndex((item) => item.id === current.id);

    await this.deleteEl(current, true);

    htmlElement.setAttribute('data-parent-id', newParentId);

    const newEl = {
      ...current,
      parentId: newParentId,
    };
    this.formElementMap.set(htmlElement.dataset.id!, newEl);
    this.insertEl(newEl, newIndex!);

    if (fromHuman) {
      this.tracing = true;
    }

    this.addTraceAction({
      undo: async () => {
        await this.moveElInDifferentParent(htmlElement, oldParentId!, oldIndex);
      },
      redo: async () => {
        await this.moveElInDifferentParent(htmlElement, newParentId, newIndex);
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
    // const parentEl = this.getElement(el.parentId);
    // if (parentEl?.isGroup) {
    //   el = parentEl;
    // }

    const parentChildren = this.getParentChildren(el.parentId);

    const idx = parentChildren.findIndex((item) => item.id === el.id);
    // 容器间的移动会删除原有元素 但是绑定的服务和事件不变
    if (!move) {
      const confirmDelete = await eventRelationStore.deleteId(el.id!);
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
      this.deleteElementMap.set(child.id!, child);
      this.formElementMap.delete(child.id!);
    });

    this.deleteElementMap.set(el.id!, el);
    this.formElementMap.delete(el.id!);

    runInAction(() => {
      parentChildren.splice(idx, 1);
    });

    // const formValues = baseStore.fieldsValue;
    // delete formValues[el.fieldName! || el.id!];

    this.addTraceAction({
      undo: async () => {
        // console.log('undo', el);
        const deletedEl = this.deleteElementMap.get(el.id!);
        if (deletedEl) {
          await this.insertEl(deletedEl, idx);
        }
      },
      redo: async () => {
        await this.deleteEl(el, move);
      },
    });

    return true;
  },

  /**
   * 复制元素
   */
  copyEl(el: IBaseElement): IBaseElement {
    // const parentEl = this.getElement(el.parentId);
    // if (parentEl?.isGroup) {
    //   el = parentEl;
    // }

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

    // baseStore.setFieldValue(newEl.id!, baseStore.fieldsValue[el.id!]);

    this.addTraceAction({
      undo: async () => {
        await this.deleteEl(newEl);
      },
      redo: async () => {
        const deletedEl = this.deleteElementMap.get(newEl.id!);
        if (deletedEl) {
          await this.insertEl(deletedEl, idx + 1);
        }
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
    if (!element) return;
    element[field] = value;
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
