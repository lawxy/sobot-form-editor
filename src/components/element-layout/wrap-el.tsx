import React, { useCallback, useRef, type PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import { Popover } from 'antd';
import c from 'classnames';
import store, { tabStore } from '@/store';
import type { IBaseElement, TCustomEvents, TMode } from '@/types';
import { EEventType, EValidateRange } from '@/types';
import { useDesignEffect } from '@/hooks';
import eventRelationStore from '@/store/eventRelationStore';
import { prefixCls } from '@/const';
import { SelectedActions } from './selected-actions';
import { EventRelationModal } from '../event-relation-modal';
import { LinkOutlined } from '@ant-design/icons';

const EventIcon: React.FC<{
  events?: TCustomEvents;
  id: string;
}> = observer(({ events, id }) => {

  const valid = events?.every((event) => {
    const { eventTargets, eventType } = event;

    if (eventType === EEventType.VALIDATE) {
      return eventTargets?.every((target) => {
        const { validateRange, validateFields } = target;
        if (validateRange === EValidateRange.CUSTOM && validateFields?.length) {
          return validateFields.every((field) => {
            return !!store.getElement(field);
          });
        }
        return true;
      });
    }

    if (!eventTargets?.length) return true;

    return eventTargets.every((target) => {
      const { targetElementId, targetServiceId } = target;
      if (!targetElementId && !targetServiceId) return true;
      if (targetElementId) return !!store.getElement(targetElementId);
      if (targetServiceId) return !!store.getService(targetServiceId);
    
      return true;
    });
  });

  const hasEventRelation = eventRelationStore.eventRelationMap?.get(id)?.size > 0

  return (
    <>
      {
        events?.length && (
          <div
            className={c({
              [prefixCls('event-icon')]: true,
              [prefixCls('event-icon-invalid')]: !valid,
            })}
          />
        )
      }
      {
        hasEventRelation && (
          <EventRelationModal id={id}>
          <div
            className={c({
              [prefixCls('event-relation-icon')]: true,
            })}
          >
            <LinkOutlined />
            </div>
          </EventRelationModal>
        )
      }
    </>
  );
});

const WrapDesignEl: React.FC<
  PropsWithChildren<{
    el: IBaseElement;
  }>
> = observer(({ children, el }) => {
  const ref = useRef<HTMLDivElement>(null);
  const prevEvents = useRef<TCustomEvents>([]);

  useDesignEffect(() => {
    eventRelationStore.clearEvents(prevEvents.current);
    eventRelationStore.iterateEl(el);
    prevEvents.current = el.events ?? [];
  }, [el.events]);

  const handleSelect = useCallback(() => {
    if (store.selectedElement?.id !== el.id) {
      store.setSelectedElement(el);
      tabStore.init();
    }
  }, [el]);

  const getMaskStyle = () => {
    // const horizontal = store.editorAttrs.horizontalGap + 2;
    // const vertical = store.editorAttrs.verticalGap + 2;
    return {
      // padding: `${vertical / 2}px ${horizontal / 2}px`,
      // margin: `-${vertical / 2}px -${horizontal / 2}px`,
      display: el?.isContainer ? 'none' : 'block',
    };
  };

  const showSelectedActions = () => {
    const parentEl = store.getElement(store.selectedElement.parentId);
    if (parentEl?.isGroup) return parentEl.id === el.id;
    return store.selectedElement?.id === el.id;
  }

  return (
    <div
      className={c({
        [prefixCls('design-wrap')]: true,
        [prefixCls('design-wrap-selected')]:
          store.selectedElement?.id === el.id,
      })}
      onMouseDownCapture={handleSelect}
      ref={ref}
    >
      <div className={prefixCls('element-mask')} style={getMaskStyle()} />
      {showSelectedActions() && <SelectedActions />}
      {children}
      <EventIcon id={el.id} events={el.events} />
    </div>
  );
});

export const WrapEl: React.FC<
  PropsWithChildren<{
    el: IBaseElement;
    mode: TMode;
  }>
> = ({ children, el, mode }) => {
  if (mode !== 'design') return <>{children}</>;

  return <WrapDesignEl el={el}>{children}</WrapDesignEl>;
};
