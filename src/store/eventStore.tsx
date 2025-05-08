/**
 * 存储事件源和事件目标间的映射关系, 用于实时通知事件失效
 */
import React from 'react';
import { makeAutoObservable } from 'mobx';
import { EventEmitter, filterDuplicateObjects, ModalConfirmPromisify, parseText } from '@/utils';
import { EEventType, EValidateRange, IBaseElement, TFormSerive, TCustomEvents, EEventAction, eventActionInChinese, eventTypeChinese } from '@/types';
import baseStore from '.';
import { prefixCls } from '..';

interface IEventRelationData {
  eventAction?: EEventAction,
  eventType?: EEventType,
  sourceId: string,
  targetId: string
}

class eventStore {
  constructor() {
    makeAutoObservable(this);
  }

  emitter = new EventEmitter();

  eventRelationMap = new Map<string, IEventRelationData[]>();

  addRelation({ targetId, sourceId, eventAction, eventType }: IEventRelationData) {

    const addEventData = { targetId, eventAction, eventType, sourceId }
    const targetEventData = this.eventRelationMap.get(targetId) ?? [];
    targetEventData.push(addEventData);
    this.eventRelationMap.set(targetId, targetEventData);

    const sourceEventData = this.eventRelationMap.get(sourceId) ?? [];
    sourceEventData.push(addEventData);
    this.eventRelationMap.set(sourceId, sourceEventData);

  }

  deleteRelation({ targetId, sourceId }: { targetId: string, sourceId: string }) {
    const targetEventData = this.eventRelationMap.get(targetId) ?? [];
    const filterTargetEventData = targetEventData.filter((item) => item.sourceId !== sourceId || item.targetId !== targetId);
    this.eventRelationMap.set(targetId, filterTargetEventData);

    const sourceEventData = this.eventRelationMap.get(sourceId) ?? [];
    const filterSourceEventData = sourceEventData.filter((item) => item.sourceId !== sourceId || item.targetId !== targetId);
    this.eventRelationMap.set(sourceId, filterSourceEventData);
  }

  getRelationData(sourceId: string) {
    const relationData = this.eventRelationMap.get(sourceId) ?? [];

    const targetElement = baseStore.getElement(sourceId);

    if (!targetElement) return relationData;
    // 容器组件要判断内部子组件
    baseStore.dfsEl(targetElement, (child) => {
      relationData.push(...this.getRelationData(child.id!));
    });

    return relationData;
  }

  findRelationWhenDelete(sourceId: string) {
    const relationData = this.getRelationData(sourceId);

    // 是否关联编辑器
    // let linkEditor = false;

    // 过滤重复数据 如果组件和子组件之间有事件关联，则数据会有重复
    const filterRelationData = filterDuplicateObjects(relationData);

    // 组件关联
    const relatedElements: IEventRelationData[] = [];
    // 服务关联
    const relatedServices: IEventRelationData[] = [];


    // filterRelationData.forEach((item) => {
    //   const { sourceId: relatedSourceId, targetId: relatedTargetId } = item;
    //   const relatedId = relatedSourceId === sourceId ? relatedTargetId : relatedSourceId;


    //   if (relatedId === baseStore.getEditorAttr('id')) {
    //     linkEditor = true;
    //   } else {
    //     const targetElement = baseStore.getElement(relatedId);
    //     if (targetElement) {
    //       relatedElements.push(item);
    //     } else {
    //       const targetService = baseStore.getService(relatedId);
    //       if (targetService) {
    //         relatedServices.push(item);
    //       }
    //     }
    //   }
    // })

    const render = (
      <div>
        <ul>
          {filterRelationData.map((item, index) => {
            const { sourceId: relatedSourceId, eventAction, eventType, targetId: relatedTargetId } = item;
            const relatedSourceElement = baseStore.getElement(relatedSourceId);
            const relatedTargetElement = baseStore.getElement(relatedTargetId);
            const relatedService = baseStore.getService(relatedTargetId);

            const isEditor = relatedTargetId === baseStore.getEditorAttr('id') || relatedSourceId === baseStore.getEditorAttr('id')

            let target = ''
            if (relatedTargetElement) {
              target = `${parseText(relatedTargetElement?.elementName)} （${relatedTargetElement?.id}）`
            } else if (relatedService) {
              target = `${relatedService.name} （${relatedService.id}）`
            }

            return (
              <li key={index}>
                <div>事件源：{isEditor ? '编辑器' : `${parseText(relatedSourceElement?.elementName)} （${relatedSourceElement?.id}）`}</div>
                <div>事件动作：{eventActionInChinese[eventAction as EEventAction]}</div>
                <div>事件类型：{eventTypeChinese[eventType as EEventType]}</div>
                <div>事件目标：{target}</div>
                <div>--------------------------------</div>
              </li>
            )
          })}
        </ul>
      </div>
    )

    return { relationData, render }
  }

  deleteId(sourceId: string) {
    // const sets = this.getRelationData(targetId);
    const { relationData, render } = this.findRelationWhenDelete(sourceId);

    if (!relationData.length) return Promise.resolve(true);

    // let linkElement = false;
    // let linkEditor = false;

    // const sourceElements = new Set<IBaseElement>();
    // const sourceServices = new Set<TFormSerive>();

    // sets.forEach((set) => {
    //   // @ts-ignore
    //   for (const sourceId of set.keys()) {
    //     const sourceElement = baseStore.getElement(sourceId);
    //     const sourceService = baseStore.getService(sourceId);

    //     if (sourceId === baseStore.getEditorAttr('id')) {
    //       linkEditor = true;
    //     } else if (sourceElement) {
    //       linkElement = true;
    //       sourceElements.add(sourceElement);
    //     } else if (sourceService) {
    //       linkElement = true;
    //       sourceServices.add(sourceService);
    //     } else {
    //       set.delete(sourceId);
    //     }
    //   }
    // });

    // if (!linkElement && !linkEditor) return Promise.resolve(true);

    const map = this.eventRelationMap;

    return ModalConfirmPromisify({
      title: '此组件(含子组件)或服务有事件关联, 确认删除?',
      content: render,
      className: prefixCls('event-relation-modal'),
      bodyStyle: {
        maxHeight: '500px',
        width: '500px',
        overflow: 'auto',
      },
      onOk() {
        relationData.forEach((item) => {
          const { sourceId: relatedSourceId, targetId: relatedTargetId } = item;
          const relatedId = relatedSourceId === sourceId ? relatedTargetId : relatedSourceId;
          const relatedData = map.get(relatedId);
          if (relatedData) {
            const filterRelatedData = relatedData.filter((item) => item.sourceId !== sourceId && item.targetId !== sourceId);
            map.set(relatedId, filterRelatedData);
          }
        })

        map.delete(sourceId);
      },
    });
  }

  iterate(events: TCustomEvents = [], type: 'add' | 'delete') {
    const handleFn =
      type === 'add'
        ? this.addRelation.bind(this)
        : this.deleteRelation.bind(this);

    events.forEach((event) => {
      const { eventTargets, eventType, eventAction } = event;
      eventTargets?.forEach((target) => {
        const { targetElementId, targetServiceId, sourceId, validateRange, validateFields } = target;
        if (targetElementId) handleFn({ targetId: targetElementId, sourceId, eventAction, eventType });
        if (targetServiceId) handleFn({ targetId: targetServiceId, sourceId, eventAction, eventType });
        if (eventType === EEventType.VALIDATE && validateRange === EValidateRange.CUSTOM && validateFields?.length) {
          validateFields.forEach((field) => {
            handleFn({ targetId: field, sourceId, eventAction, eventType });
          });
        }
      });
    });
  }

  iterateEl(el: IBaseElement) {
    const { events } = el;
    this.iterate(events, 'add');
    baseStore.dfsEl(el, (child) => {
      this.iterateEl(child);
    });
  }

  clearEvents(events: TCustomEvents = []) {
    this.iterate(events, 'delete');
  }

  clearMap() {
    this.eventRelationMap.clear();
  }
}

export default new eventStore();
