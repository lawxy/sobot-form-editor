import type { IBaseElement } from '@/types';
import {
  handleOnEvent,
} from '@/utils';
import eventStore from '@/store/eventStore';
import { useFormEffect } from '.';
// export * from '@/utils/handle-emit-event';

export const useRegisterEvents = (id: IBaseElement['id']) => {

  useFormEffect(() => {
    if (!id) return;
    eventStore.emitter.on(id!, handleOnEvent);
    return () => {
      eventStore.emitter.off(id!);
    };
  }, [id]);

};
