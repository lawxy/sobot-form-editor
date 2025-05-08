/**
 * 存储事件源和事件目标间的映射关系, 用于实时通知事件失效
 */
import React from 'react';
import { makeAutoObservable } from 'mobx';
import { EventEmitter, ModalConfirmPromisify, parseText } from '@/utils';
import { EEventType, EValidateRange, IBaseElement, TFormSerive, TCustomEvents, EEventAction } from '@/types';
import baseStore from '.';

class eventStore {
  constructor() {
    makeAutoObservable(this);
  }

  emitter = new EventEmitter();

  eventRelationMap = new Map();

  addRelation({ targetId, sourceId, eventAction, eventType }: { targetId: string, sourceId: string, eventAction?: EEventAction, eventType?: EEventType }) {
    const set = this.eventRelationMap.get(targetId) ?? new Set();
    set.add(sourceId);
    this.eventRelationMap.set(targetId, set);

    const set2 = this.eventRelationMap.get(sourceId) ?? new Set();
    set2.add(targetId)
    this.eventRelationMap.set(sourceId, set2);

    // 设置关联关系元数据
    const targetObj = baseStore.getElement(targetId) || baseStore.getService(targetId);
    const sourceObj = baseStore.getElement(sourceId) || baseStore.getService(sourceId);

    const metadata = { targetId, eventAction, eventType, sourceId }
    const eventMetadata = Reflect.getMetadata('eventMetadata', targetObj!) ?? [];
    eventMetadata.push(metadata);
    Reflect.defineMetadata('eventMetadata', eventMetadata, targetObj!);

    const eventMetadata2 = Reflect.getMetadata('eventMetadata', sourceObj!) ?? [];
    eventMetadata2.push(metadata);
    Reflect.defineMetadata('eventMetadata', eventMetadata2, sourceObj!);

  }

  deleteRelation({ targetId, sourceId }: { targetId: string, sourceId: string }) {
    const set = this.eventRelationMap.get(targetId) ?? new Set();
    set.delete(sourceId);
    this.eventRelationMap.set(targetId, set);
  }

  getSetsFromId(targetId: string) {
    const sets: Array<Set<string>> = [];
    const set = this.eventRelationMap.get(targetId);
    if (set) sets.push(set);

    const targetElement = baseStore.getElement(targetId);

    if (!targetElement) return sets;
    // 容器组件要判断内部子组件
    baseStore.dfsEl(targetElement, (child) => {
      sets.push(...this.getSetsFromId(child.id!));
    });

    return sets;
  }

  getEventMetadata(targetId: string) {
    const targetElement = baseStore.getElement(targetId);
    if (!targetElement) return [];
    const eventMetadata = Reflect.getMetadata('eventMetadata', targetElement) ?? [];
  }

  findRelationWhenDelete(targetId: string) {
    const sets = this.getSetsFromId(targetId);

    let linkElement = false;
    let linkEditor = false;

    const sourceElements = new Set<IBaseElement>();
    const sourceServices = new Set<TFormSerive>();

    // const targetElement = baseStore.getElement(targetId);
    const eventMetadata = Reflect.getMetadata('eventMetadata', baseStore.getElement(targetId)!) ?? [];
    console.log(eventMetadata);

    sets.forEach((set) => {
      // @ts-ignore
      for (const sourceId of set.keys()) {
        const sourceElement = baseStore.getElement(sourceId);
        const sourceService = baseStore.getService(sourceId);

        if (sourceId === baseStore.getEditorAttr('id')) {
          linkEditor = true;
        } else if (sourceElement) {
          linkElement = true;
          sourceElements.add(sourceElement);
        } else if (sourceService) {
          linkElement = true;
          sourceServices.add(sourceService);
        } else {
          set.delete(sourceId);
        }
      }
    });

    const render2 =(
      <div>
        关联关系：

      </div>

    )

    const render = (
      <div>
        {linkEditor && (
          <div>
            <span>关联编辑器</span>
            <ul>
              <li>
                <span>{baseStore.getEditorAttr('id')}</span>
              </li>
            </ul>
          </div>
        )}
        {sourceElements.size > 0 && (
          <div>
            <span>关联组件</span>
            <ul>
              {Array.from(sourceElements).map((el) => (
                <li key={el.id}>
                  <div>
                    {parseText(el.elementName) ? parseText(el.elementName) + ' ( ' + el.id + ' )' : el.id}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {sourceServices.size > 0 && (
          <div>
            <span>关联服务</span>
            <ul>
              {Array.from(sourceServices).map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )

    return { sets, linkElement, linkEditor, render }
  }

  deleteId(targetId: string) {
    // const sets = this.getSetsFromId(targetId);
    const { sets, linkElement, linkEditor, render } = this.findRelationWhenDelete(targetId);

    if (!sets.length) return Promise.resolve(true);

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

    if (!linkElement && !linkEditor) return Promise.resolve(true);

    const map = this.eventRelationMap;

    return ModalConfirmPromisify({
      title: '此组件(含子组件)或服务有事件关联, 确认删除?',
      content: render,
      bodyStyle: {
        maxHeight: '500px',
        overflow: 'auto',
      },
      onOk() {
        const set = map.get(targetId);
        if (set) {
          for (const sourceId of set.keys()) {
            const sourceSet = map.get(sourceId);
            if (sourceSet) {
              sourceSet.delete(targetId);
              map.set(sourceId, sourceSet);
            }
          }
        }
        map.delete(targetId);
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
            handleFn({ targetId: field, sourceId, eventAction, eventType});
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
