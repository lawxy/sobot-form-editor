import React, { useCallback, useRef, type PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import c from 'classnames';
import store, { tabStore } from '@/store';
import type { IBaseElement, TCustomEvents, TMode } from '@/types';
import { useDesignEffect } from '@/hooks';
import eventStore from '@/store/eventStore';
import { prefixCls } from '@/const';
import { SelectedActions } from './selected-actions';

const EventIcon: React.FC<{
  events?: TCustomEvents;
}> = observer(({ events }) => {
  if (!events?.length) return null;

  const valid = events.every((event) => {
    const { eventTargets } = event;
    if (!eventTargets?.length) return true;
    return eventTargets.every((target) => {
      const { targetElementId, targetServiceId } = target;
      if (!targetElementId && !targetServiceId) return true;
      if (targetElementId) return !!store.getElement(targetElementId);
      if (targetServiceId) return !!store.getService(targetServiceId);
      return true;
    });
  });

  return (
    <div
      className={c({
        [prefixCls('event-icon')]: true,
        [prefixCls('event-icon-invalid')]: !valid,
      })}
    />
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
    eventStore.clearEvents(prevEvents.current);
    eventStore.iterateEl(el);
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
      {/* <div className={prefixCls('element-mask')} style={getMaskStyle()} /> */}
      {store.selectedElement?.id === el.id && <SelectedActions />}
      {children}
      <EventIcon events={el.events} />
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
