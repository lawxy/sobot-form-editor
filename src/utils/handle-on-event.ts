import { cloneDeep, result } from 'lodash-es';
import type { NamePath } from 'antd/es/form/interface';
import {
  EEventType,
  EChangeStatePayload,
  TFormSerive,
  ELinkRefreshType,
  type IBaseElement,
  EValidateRange,
  EEventAction,
} from '@/types';
import { dynamicGetStore } from '.';
import { triggerService } from './trigger-service';
import type { TEmitData } from './handle-emit-event';
import { parseJsAsync, getValueFromInput } from '@/utils';
import extendStore from '@/store/extendStore';
// 值变化事件判断触发值是否满足条件
const valueChangeContinue = (params: TEmitData) => {
  const { eventAction, triggerValue, eventValue } = params;
  if(!triggerValue) return true;
  if(eventAction === EEventAction.VALUE_CHANGE) {
    return getValueFromInput(triggerValue) === eventValue;
  }
  return true;
}

const formatEventValue = async (params: TEmitData) => {
  const { eventValueInterceptor, eventValue } = params;
  if(!eventValueInterceptor) return params;
  const { value: resultValue } = await parseJsAsync({
    jsFunction: eventValueInterceptor,
    valueWhenError: eventValue,
    dependencies: [eventValue],
    dependenciesString: ['eventValue'],
  });
  return { ...params, eventValue: resultValue };
}
// 设置组件
export const triggerSettingValue = async (params: TEmitData) => {
  const { eventValue, targetPayload, targetElementId, eventAction, triggerValue } = await formatEventValue(params);
  const store = dynamicGetStore();
  if (!store.getElement(targetElementId!)) return;

  switch (targetPayload) {
    case EChangeStatePayload.SYNC:
      const element = store.getElement(targetElementId!);
      if (!element) return;
      const { fieldName } = element;
      return store.setFieldValue(fieldName! || targetElementId!, eventValue);
    case EChangeStatePayload.SHOW:
      return store.setElementProp(targetElementId!, 'hidden', false);
    case EChangeStatePayload.HIDDEN:
      return store.setElementProp(targetElementId!, 'hidden', true);
    case EChangeStatePayload.RESET_PAGE:
      return store.setElementProp(targetElementId!, 'current', 1);
  }
};

// 关联服务
export const triggerLinkingService = async ({serviceId, eventValue}: {serviceId: string, eventValue: any}) => {
  const store = dynamicGetStore();
  const currentService = store.getService(serviceId) as TFormSerive;
  const { linkingElements } = currentService;
    linkingElements?.forEach((item) => {
      const { id } = item;
      store.setElementProp(id, 'linkLoading', true);
    });
    
    try {
      const serviceRes: any = await triggerService(serviceId!);
      // 扩展服务事件
      extendStore.extendServiceEmitter.emit(currentService.id!, serviceRes);

      linkingElements?.forEach((item) => {
        const {
          id,
          customRefreshField,
          linkRefreshType,
          getFieldFromService = 'data',
          customJs,
        } = item;

        store.setElementProp(id, 'linkLoading', false);

        const finalRes: any = result(serviceRes, getFieldFromService);

        const element = store.getElement(id);
        if (!element || !linkRefreshType) return;

        if (linkRefreshType === ELinkRefreshType.FIELDVALUE) {
          const { fieldName } = element;
          store.setFieldValue(fieldName! || id, finalRes);
        } 

        if(linkRefreshType === ELinkRefreshType.OPTIONS) {
          store.setElementProp(id, ELinkRefreshType.OPTIONS, finalRes);
        }

        if(linkRefreshType === ELinkRefreshType.CUSTOMFIELD) {
          store.setElementProp(id, customRefreshField as keyof IBaseElement, finalRes);
        }

        if(linkRefreshType === ELinkRefreshType.CUSTOMJS) {
          parseJsAsync({
            jsFunction: customJs!,
            valueWhenError: undefined,
            dependencies: [finalRes, eventValue],
            dependenciesString: ['serviceValue', 'eventValue'],
          });
        }
        
      });
      
      return serviceRes;
    } catch (error) {
      console.error('error', error);
      linkingElements?.forEach((item) => {
        const { id } = item;
        store.setElementProp(id, 'linkLoading', false);
      });
    }
}

// 更新服务 和 关联服务
export const triggerRefreshService = async (serviceParams: TEmitData) => {
  const {
    targetServiceId,
    updateField,
    targetPayload,
    eventValue,
    refreshFlag,
    urlAppended,
  } = await formatEventValue(serviceParams);
  const store = dynamicGetStore();

  const currentService = store.getService(targetServiceId!) as TFormSerive;
  // 拼接参数
  if (targetPayload === EChangeStatePayload.APPEND) {
    const { params = {} } = currentService;
    const newParams = cloneDeep(params);
    if (urlAppended) {
      newParams[urlAppended!] = eventValue;
    }
    store.setService(targetServiceId!, { params: newParams });
  }
  // 更新参数
  if (targetPayload === EChangeStatePayload.UPDATE) {
    const { data = {} } = currentService;
    const newData = cloneDeep(data);
    if (updateField) {
      newData[updateField!] = eventValue;
    }
    store.setService(targetServiceId!, { data: newData });
  }
  // 清空data
  if (targetPayload === EChangeStatePayload.CLEAR_DATA) {
    store.setService(targetServiceId!, { params: {} });
  }
  // 清空params
  if (targetPayload === EChangeStatePayload.CLEAR_PARAMS) {
    store.setService(targetServiceId!, { params: {} });
  }
  // 提交表单
  if (targetPayload === EChangeStatePayload.SUBMIT) {
    const { data = {} } = currentService;
    const newData = cloneDeep(data);
    newData[updateField!] = eventValue;
    store.setService(targetServiceId!, { data: store.getFieldsValue() });
  }
  // 上传Schema
  if (targetPayload === EChangeStatePayload.UPLOAD_SCHEMA) {
    const { data = {} } = currentService;
    const newData = cloneDeep(data);
    newData[updateField!] = eventValue;
    store.setService(targetServiceId!, { data: store.getSchema() });
  }

  // 刷新服务
  if (refreshFlag) {
    // 触发关联服务
    triggerLinkingService({serviceId: targetServiceId!, eventValue});
    // const { linkingElements } = currentService;
    // linkingElements?.forEach((item) => {
    //   const { id } = item;
    //   store.setElementProp(id, 'linkLoading', true);
    // });
    
    // try {
    //   const serviceRes: any = await triggerService(targetServiceId!);
    //   // 扩展服务事件
    //   extendStore.extendServiceEmitter.emit(currentService.id!, serviceRes);

    //   linkingElements?.forEach((item) => {
    //     const {
    //       id,
    //       customRefreshField,
    //       linkRefreshType,
    //       getFieldFromService = 'data',
    //       customJs,
    //     } = item;

    //     store.setElementProp(id, 'linkLoading', false);

    //     const finalRes: any = result(serviceRes, getFieldFromService);

    //     const element = store.getElement(id);
    //     if (!element || !linkRefreshType) return;

    //     if (linkRefreshType === ELinkRefreshType.FIELDVALUE) {
    //       const { fieldName } = element;
    //       store.setFieldValue(fieldName! || id, finalRes);
    //     } 

    //     if(linkRefreshType === ELinkRefreshType.OPTIONS) {
    //       store.setElementProp(id, ELinkRefreshType.OPTIONS, finalRes);
    //     }

    //     if(linkRefreshType === ELinkRefreshType.CUSTOMFIELD) {
    //       store.setElementProp(id, customRefreshField as keyof IBaseElement, finalRes);
    //     }

    //     if(linkRefreshType === ELinkRefreshType.CUSTOMJS) {
    //       parseJsAsync({
    //         jsFunction: customJs!,
    //         valueWhenError: undefined,
    //         dependencies: [finalRes, eventValue],
    //         dependenciesString: ['serviceValue', 'eventValue'],
    //       });
    //     }
        
    //   });
    // } catch (error) {
    //   console.error('error', error);
    //   linkingElements?.forEach((item) => {
    //     const { id } = item;
    //     store.setElementProp(id, 'linkLoading', false);
    //   });
    // }
  }
};

// 自定义js
export const triggerCustomJs = async (params: TEmitData) => {
  const { customJs, eventValue, prevFunctionReturn, sourceId } = await formatEventValue(params);
  const store = dynamicGetStore();
  if (!store.getElement(sourceId!)) return;

  const { value: resultValue } = await parseJsAsync({
    jsFunction: customJs!,
    valueWhenError: undefined,
    dependencies: [eventValue, prevFunctionReturn],
    dependenciesString: ['eventValue', 'prevFunctionReturn'],
  });
  return resultValue;
};

// 表单校验
export const triggerValidate = async (params: TEmitData) => {
  const { validateRange, sourceId, validateFields } = params;
  const store = dynamicGetStore();

  let fields;
  switch(validateRange) {
    case EValidateRange.CURRENT:
      fields = [sourceId!];
      break;
    case EValidateRange.CUSTOM:
      fields = validateFields;
      break;
  }
  const fieldsName = fields?.map((field) => {
    const element = store.getElement(field);
    if (!element) return;
    const { fieldName, id } = element;
    return fieldName || id;
  });

  return store.formInstance?.validateFields(fieldsName as NamePath[]) as Promise<any>;
};

// 链接跳转
export const triggerJump = async (params: TEmitData) => {
  const { jumpUrl, newWindow } = params;
      let href = jumpUrl;
    if (jumpUrl?.startsWith('http')) {
      href = jumpUrl;
    } else {
      href = `${window.location.origin}${jumpUrl!}`;
    }
    if (newWindow) {
      window.open(href, '_blank');
    } else {
      window.location.href = href;
    }
};

export const handleOnEvent = async (params: TEmitData) => {
  const { eventType } = params;
  // console.log('params', params);
  if(!valueChangeContinue(params)) return;

  switch (eventType) {
    case EEventType.SETTING_VALUE:
      return await triggerSettingValue(params);
    case EEventType.UPDATE_SERVICE:
      return await triggerRefreshService(params);
    case EEventType.VALIDATE:
      return await triggerValidate(params);
    case EEventType.JMUP:
      return await triggerJump(params);
    case EEventType.CUSTOM_JS:
      return await triggerCustomJs(params);
  }
};
