import { useEffect, useState } from 'react';
import type { IBaseElement } from '@/types';
import {
  handleEmitEvent,
  type TEventFormatFunctions,
} from '@/utils';
import eventStore from '@/store/eventStore';
// import { useForceRender, useFormEffect } from '.';

export * from '@/utils/handle-emit-event';

interface IRegisterEvents {
  (element: Pick<IBaseElement, 'id' | 'events'>): any;
}

export const useGetEventFunctions: IRegisterEvents = (element) => {
  const { events } = element;
  // const eventFunctions = useRef<TEventFormatFunctions>({});
  const [eventFunctions, setEventFunctions] = useState<TEventFormatFunctions>({});
  // const forceRender = useForceRender();

  useEffect(() => {
    if (!events?.length) return;
    const functions = handleEmitEvent(eventStore.emitter, events);
    // eventFunctions.current = functions;
    setEventFunctions(functions);
    // forceRender();
  }, [events]);

  return { eventFunctions };
};