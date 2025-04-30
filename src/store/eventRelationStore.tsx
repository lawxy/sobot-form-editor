/**
 * 存储事件源和事件目标间的映射关系, 用于实时通知事件失效
 */
import React from 'react';
import { makeAutoObservable } from 'mobx';
import { EventEmitter, ModalConfirmPromisify } from '@/utils';
import { EEventType, EValidateRange, IBaseElement, TFormSerive, TCustomEvents } from '@/types';
import baseStore from '.';

class EventRelationStore {
  constructor() {
    makeAutoObservable(this);
  }

  emitter = new EventEmitter();

  eventRelationMap = new Map();

  addRelation(targetId: string, sourceId: string) {
    const set = this.eventRelationMap.get(targetId) ?? new Set();
    set.add(sourceId);
    this.eventRelationMap.set(targetId, set);

    const set2 = this.eventRelationMap.get(sourceId)  ?? new Set();
    set2.add(targetId)
    this.eventRelationMap.set(sourceId, set2);
  }

  deleteRelation(targetId: string, sourceId: string) {
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

  deleteId(targetId: string) {
    const sets = this.getSetsFromId(targetId);

    if (!sets.length) return Promise.resolve(true);

    let linkElement = false;
    let linkEditor = false;

    const sourceElements = new Set<IBaseElement>();
    const sourceServices = new Set<TFormSerive>();

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

    if (!linkElement && !linkEditor) return Promise.resolve(true);

    const map = this.eventRelationMap;

    return ModalConfirmPromisify({
      title: '此组件(含内部组件)或服务有事件关联, 确认删除?',
      content: (
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
                  <li key={el.id}>{el.elementName?.langText ? el.elementName?.langText + ' ( ' + el.id + ' )' : el.id}</li>
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
      ),
      onOk() {
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
      const { eventTargets, eventType } = event;
      eventTargets?.forEach((target) => {
        const { targetElementId, targetServiceId, sourceId, validateRange, validateFields } = target;
        if (targetElementId) handleFn(targetElementId, sourceId);
        if (targetServiceId) handleFn(targetServiceId, sourceId);
        if (eventType === EEventType.VALIDATE && validateRange === EValidateRange.CUSTOM && validateFields?.length) {
          validateFields.forEach((field) => {
            handleFn(field, sourceId);
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

export default new EventRelationStore();
