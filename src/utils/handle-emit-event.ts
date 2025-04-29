import {
  EEventAction,
  EEventType,
  IEventTarget,
  TCustomEvent,
  TCustomEvents,
  eventActionInChinese,
  eventTypeChinese,
  EDelay,
} from '@/types';
import { EventEmitter, getValueFromInput, dynamicGetStore } from '@/utils';
import { validateParams, asyncDebounce, asyncThrottle } from '.';
interface IParams {
  emitter: EventEmitter;
  eventType: EEventType;
  target: IEventTarget;
  eventAction?: EEventAction;
}

export interface IEventFunction {
  (v?: any): Promise<void>;
  sourceId: string;
  series?: boolean;
  eventType: EEventType;
}

export type TEventFunctions = {
  [key in EEventAction]?: Array<IEventFunction>;
};

export type TEventFormatFunctions = {
  [key in EEventAction]?: IEventFunction;
};

export type TEmitData = Partial<IEventTarget> & {
  eventType: EEventType;
  eventValue?: any; // 事件传入的相关值
  prevFunctionReturn?: any; // 上一个事件函数的返回值
  eventAction: EEventAction;
};

const withConfig = (fn: (v: any, prevFunctionReturn: any) => Promise<any>, target: IEventTarget) => {
  const { series, delayTime, delayType, sourceId } = target;
  if (delayType === EDelay.DEBOUNCE && delayTime) {
    fn = asyncDebounce(fn, delayTime);
  }
  if (delayType === EDelay.THROTTLE && delayTime) {
    fn = asyncThrottle(fn, delayTime);
  }
  
  Object.assign(fn, { series, sourceId });

  return fn;
};

// 设置组件
export const emitSettingValue = (params: IParams) => {
  const { emitter, eventType, target, eventAction } = params;
  const { targetElementId, targetPayload } = target;
  const validate = validateParams([targetElementId, targetPayload]);
  if (!validate) return;

  return withConfig(
    async (eventValue: any, prevFunctionReturn: any) =>
      await emitter.emit(targetElementId!, {
        eventType,
        eventValue,
        prevFunctionReturn,
        eventAction,
        ...target,
      } as TEmitData),
    target,
  );
};

// 更新服务
export const emitRefreshService = (params: IParams) => {
  const { emitter, eventType, target, eventAction } = params;
  const {
    targetServiceId,
    targetPayload,
  } = target;
  const validate = validateParams([targetServiceId, targetPayload]);
  if (!validate) return;
  const store = dynamicGetStore();

  if (!store.getService(targetServiceId!)) return;

  return withConfig(
    async (eventValue: any, prevFunctionReturn: any) =>
      await emitter.emit(targetServiceId!, {
        eventType,
        eventValue,
        prevFunctionReturn,
        eventAction,
        ...target
      } as TEmitData),
    target,
  );
};

// 表单校验
export const emitValidateForm = (params: IParams) => {
  const { emitter, eventType, target, eventAction } = params;

  const { sourceId } = target;

  return withConfig(
    async () =>
      await emitter.emit(sourceId!, {
        eventType,
        eventAction,
        ...target
      } as TEmitData),
    target,
  );
};

// 跳转链接
export const emitJumpUrl = (params: IParams) => {
  const { emitter, eventType, target, eventAction } = params;
  const { jumpUrl, sourceId } = target;
  const validate = validateParams([jumpUrl]);
  if (!validate) return;

  // return withConfig(async (value: any, prevFunctionReturn: any) => {
  //   let href = jumpUrl;
  //   if (jumpUrl?.startsWith('http')) {
  //     href = jumpUrl;
  //   } else {
  //     href = `${window.location.origin}${jumpUrl!}`;
  //   }
  //   if (newWindow) {
  //     window.open(href, '_blank');
  //   } else {
  //     window.location.href = href;
  //   }
  // }, target);

  return withConfig(
    async () =>
      await emitter.emit(sourceId!, {
        eventType,
        eventAction,
        ...target
      } as TEmitData),
    target,
  );
};

// 自定义js
export const emitCustomJs = (params: IParams) => {
  const { emitter, eventType, target, eventAction } = params;
  const { customJs, sourceId } = target;
  const validate = validateParams([customJs]);
  if (!validate) return;

  return withConfig(
    async (eventValue: any, prevFunctionReturn: any) =>
      await emitter.emit(sourceId!, {
        eventType,
        eventValue,
        prevFunctionReturn,
        eventAction,
        ...target
      } as TEmitData),
    target,
  );
};

const handleError = ({
  emitFn,
  error,
  action,
}: {
  emitFn: IEventFunction;
  error: any;
  action: EEventAction;
}) => {
  const { sourceId, eventType } = emitFn;
  const store = dynamicGetStore();
  const el = store.getElement(sourceId);
  console.log(`
    事件报错:\n 
    组件: ${el?.elementName?.langText ?? sourceId}\n 
    事件动作: ${eventActionInChinese[action as EEventAction]} - ${
    eventTypeChinese[eventType]
  } \n
    错误返回: ${JSON.stringify(error)}`);
};


const formatFunctions = (functions: TEventFunctions): TEventFormatFunctions => Object.entries(
  functions,
).reduce((memo: TEventFormatFunctions, [action, emitFns]: any) => {
  // @ts-ignore
  memo[action] = async (v: any) => {
    let prevFunctionReturn;
    for (let i = 0; i < emitFns.length; i++) {
      const emitFn: any = emitFns[i];
      try {
        if (emitFn?.series) {
          // console.log('emitFn', emitFn, emitFn instanceof Promise)
          // console.log('v', v)
          const res: any = await emitFn?.(v, prevFunctionReturn);
          prevFunctionReturn = res;
        } else {
          emitFn(v, prevFunctionReturn)?.catch((e: any) => {
            handleError({
              emitFn,
              error: e,
              action,
            });
          });
          // prevFunctionReturn = undefined;
        }
      } catch (e) {
        return handleError({
          emitFn,
          error: e,
          action,
        });
      }
    }
  };

  return memo;
}, {});

export const handleEmitEvent = (
  emitter: EventEmitter,
  events: TCustomEvents,
): { functions: TEventFormatFunctions, immediateFunctions: TEventFormatFunctions } => {
  
  const functions: TEventFunctions = {};
  const immediateFunctions: TEventFunctions = {};

  events.forEach((event: TCustomEvent) => {
    const { eventAction, eventType, eventTargets } = event;
    eventTargets?.forEach((target) => {
      const params = { emitter, eventType, target, eventAction } as IParams;
      let emitFn: IEventFunction | undefined;
      switch (eventType) {
        case EEventType.SETTING_VALUE:
          emitFn = emitSettingValue(params) as IEventFunction;
          break;
        case EEventType.UPDATE_SERVICE:
          emitFn = emitRefreshService(params) as IEventFunction;
          break;
        case EEventType.VALIDATE:
          emitFn = emitValidateForm(params) as IEventFunction;
          break;
        case EEventType.JMUP:
          emitFn = emitJumpUrl(params) as IEventFunction;
          break;
        case EEventType.CUSTOM_JS:
          emitFn = emitCustomJs(params) as IEventFunction;
          break;
      }

      if (!emitFn) return;
      Object.assign(emitFn, { eventType });
      if (functions[eventAction!]) {
        functions[eventAction!]?.push(emitFn);
      } else {
        functions[eventAction!] = [emitFn];
      }

      if (target.immediately) {
        if (immediateFunctions[eventAction!]) {
          immediateFunctions[eventAction!]?.push(emitFn);
        } else {
          immediateFunctions[eventAction!] = [emitFn];
        }
      }
    });
  });

  // const formatFunctions: TEventFormatFunctions = Object.entries(
  //   functions,
  // ).reduce((memo: TEventFormatFunctions, [action, emitFns]: any) => {
  //   // @ts-ignore
  //   memo[action] = async (v: any) => {
  //     let prevFunctionReturn;
  //     for (let i = 0; i < emitFns.length; i++) {
  //       const emitFn: any = emitFns[i];
  //       try {
  //         if (emitFn?.series) {
  //           // console.log('emitFn', emitFn, emitFn instanceof Promise)
  //           // console.log('v', v)
  //           const res: any = await emitFn?.(v, prevFunctionReturn);
  //           prevFunctionReturn = res;
  //         } else {
  //           emitFn(v, prevFunctionReturn)?.catch((e: any) => {
  //             handleError({
  //               emitFn,
  //               error: e,
  //               action,
  //             });
  //           });
  //           // prevFunctionReturn = undefined;
  //         }
  //       } catch (e) {
  //         return handleError({
  //           emitFn,
  //           error: e,
  //           action,
  //         });
  //       }
  //     }
  //   };

  //   return memo;
  // }, {});

  // return formatFunctions;
  return { functions: formatFunctions(functions), immediateFunctions: formatFunctions(immediateFunctions) };
};
