import React from 'react';
import { Button, message } from 'antd';
import { cloneDeep, groupBy } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { prefixCls } from '@/const';
import store from '@/store';
import { useCurrent } from '@/hooks';
import { handleLinkService, handleUnLinkService } from '@/utils';
import {
  TCustomEvent,
  EChangeType,
  EEventAction,
  eventActionInChinese,
  EEventType,
} from '@/types';

import { EventCollapse } from './event-collapse';
import { EventModal } from '../event-modal';

export * from './event-collapse';

import './style.less';

const formatForCollapse = (events: TCustomEvent[]) => {
  const group = groupBy(events, 'eventAction');
  return Object.entries(group).map(([action, events]) => {
    return {
      label: eventActionInChinese[action as EEventAction],
      events,
    };
  });
};

export const EventSetting: React.FC<{
  eventActions: EEventAction[];
  eventTypeOptions?: EEventType[];
  type: 'element' | 'form';
}> = observer(({ eventActions, type, eventTypeOptions }) => {
  const { current, setProp } = useCurrent(type);

  const sourceId = current.id;

  const handleSaveEvents = (type: EChangeType, event: TCustomEvent) => {
    const events = cloneDeep(current?.events || []);
    if (type === EChangeType.ADD) {
      let sameActionEvent: TCustomEvent | undefined = events.find(
        (existEvent) =>
          existEvent.eventAction === event.eventAction &&
          existEvent.eventType === event.eventType,
      );
      if (sameActionEvent) {
        sameActionEvent.eventTargets = sameActionEvent.eventTargets?.concat(
          event.eventTargets || [],
        );
        message.success('新增事件已被合并');
      } else {
        events.push(event);
      }
      handleLinkService(event);
    } else {
      const idx = current?.events?.findIndex((evt) => event.id === evt.id);
      handleUnLinkService(events[idx!]);
      events[idx!] = event;
      handleLinkService(event);
    }
    // modal过度效果
    setTimeout(() => {
      setProp('events', events);
    }, 200);
  };

  const handleDelete = (id: string) => {
    const events = cloneDeep(current?.events);
    const idx = current?.events?.findIndex((event) => event.id === id);
    handleUnLinkService(events![idx!]);
    events!.splice(idx!, 1);
    setProp('events', events);
  };

  return (
    <div className={prefixCls('event-common-wrap')}>
      <EventModal
        eventActions={eventActions}
        onOk={(evt: TCustomEvent) => handleSaveEvents(EChangeType.ADD, evt)}
        type={EChangeType.ADD}
        sourceId={sourceId!}
        eventTypeOptions={eventTypeOptions}
      >
        <Button type="dashed" className={prefixCls('event-button-add')}>
          + 新增事件
        </Button>
      </EventModal>
      <EventCollapse
        collopaseItems={formatForCollapse(current?.events || [])}
        onDelete={handleDelete}
        EditComponent={({ children, evt }) => {
          return (
            <EventModal
              eventActions={eventActions}
              onOk={(evt: TCustomEvent) =>
                handleSaveEvents(EChangeType.EDIT, evt)
              }
              event={evt}
              type={EChangeType.EDIT}
              sourceId={sourceId!}
              eventTypeOptions={eventTypeOptions}
            >
              {children}
            </EventModal>
          );
        }}
      />
    </div>
  );
});
