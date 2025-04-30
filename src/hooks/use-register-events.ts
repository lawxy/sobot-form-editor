import type { IBaseElement } from '@/types';
import {
  handleOnEvent,
} from '@/utils';
import eventRelationStore from '@/store/eventRelationStore';
import { useFormEffect } from '.';
// export * from '@/utils/handle-emit-event';

export const useRegisterEvents = (id: IBaseElement['id']) => {

  useFormEffect(() => {
    if (!id) return;
    eventRelationStore.emitter.on(id!, handleOnEvent);
    return () => {
      eventRelationStore.emitter.off(id!);
    };
  }, [id]);

};
