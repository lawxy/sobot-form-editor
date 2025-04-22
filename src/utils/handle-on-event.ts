import { cloneDeep, result } from 'lodash-es';
import {
  EEventType,
  EChangeStatePayload,
  TFormSerive,
  ELinkRefreshType,
  type IBaseElement,
  EValidateType,
} from '@/types';
import { dynamicGetStore } from '.';
import { triggerService } from './trigger-service';
import type { TEmitData } from './handle-emit-event';
import { parseJs } from '@/utils';

// 设置组件
export const triggerSettingValue = (params: TEmitData) => {
  const { setValue, value, targetPayload, targetElementId, customJs, prevFunctionReturn } = params;
  const store = dynamicGetStore();
  if (!store.getElement(targetElementId!)) return;
  switch (targetPayload) {
    case EChangeStatePayload.SYNC:
      return store.setFieldValue(targetElementId!, value);
    // case EChangeStatePayload.CUSTOM:
    //   // return store.setFieldValue(targetElementId!, setValue);
    //   const { value: resultValue } = parseJs({
    //     jsFunction: customJs!,
    //     valueWhenError: undefined,
    //     dependencies: [store, value, prevFunctionReturn],
    //     dependenciesString: ['store', 'value', 'prevFunctionReturn'],
    //   });
    //   return resultValue;
    case EChangeStatePayload.RESET_PAGE:
      return store.setElementProp(targetElementId!, 'current', 1);
  }
};

// 更新服务
export const triggerRefreshService = async (serviceParams: TEmitData) => {
  const {
    targetServiceId,
    updateField,
    targetPayload,
    value,
    refreshFlag,
    urlAppended,
    prevFunctionReturn
  } = serviceParams;
  const store = dynamicGetStore();

  const servId = targetServiceId!;
  const currentService = store.getService(servId) as TFormSerive;
  // 拼接参数
  if (targetPayload === EChangeStatePayload.APPEND) {
    const { params = {} } = currentService;
    const newParams = cloneDeep(params);
    if (urlAppended) {
      newParams[urlAppended!] = value;
    }
    store.setService(servId, { params: newParams });
  }
  // 更新参数
  if (targetPayload === EChangeStatePayload.UPDATE) {
    const { data = {} } = currentService;
    const newData = cloneDeep(data);
    if (updateField) {
      newData[updateField!] = value;
    }
    store.setService(servId, { data: newData });
  }
  // 清空data
  if (targetPayload === EChangeStatePayload.CLEAR_DATA) {
    store.setService(servId, { params: {} });
  }
  // 清空params
  if (targetPayload === EChangeStatePayload.CLEAR_PARAMS) {
    store.setService(servId, { params: {} });
  }
  // 提交表单
  if (targetPayload === EChangeStatePayload.SUBMIT) {
    const { data = {} } = currentService;
    const newData = cloneDeep(data);
    newData[updateField!] = value;
    store.setService(servId, { data: store.getFieldsValue() });
  }
  // 上传Schema
  if (targetPayload === EChangeStatePayload.UPLOAD_SCHEMA) {
    const { data = {} } = currentService;
    const newData = cloneDeep(data);
    newData[updateField!] = value;
    store.setService(servId, { data: store.getSchema() });
  }

  // 刷新服务
  if (refreshFlag) {
    // 触发关联服务
    const { linkingElements } = currentService;
    linkingElements?.forEach((item) => {
      const { id } = item;
      store.setElementProp(id, 'linkLoading', true);
    });
    try {
      const serviceRes: any = await triggerService(targetServiceId!);
      linkingElements?.forEach((item) => {
        const {
          id,
          customRefreshField,
          linkRefreshType,
          getFieldFromService = 'data',
        } = item;
        store.setElementProp(id, 'linkLoading', false);

        const finalRes: any = result(serviceRes, getFieldFromService);

        const element = store.getElement(id);
        if (!element || !linkRefreshType) return;
        if (linkRefreshType === ELinkRefreshType.FIELDVALUE) {
          store.setFieldValue(id, finalRes);
        } else {
          const updateField =
            linkRefreshType === ELinkRefreshType.OPTIONS
              ? ELinkRefreshType.OPTIONS
              : (customRefreshField as keyof IBaseElement);
          if (updateField) {
            store.setElementProp(id, updateField, finalRes);
          }
        }
      });
    } catch {
      linkingElements?.forEach((item) => {
        const { id } = item;
        store.setElementProp(id, 'linkLoading', false);
      });
    }
  }
};

// 自定义js
export const triggerCustomJs = async (params: TEmitData) => {
  const { customJs, value, prevFunctionReturn, targetElementId } = params;
  const store = dynamicGetStore();
  if (!store.getElement(targetElementId!)) return;

  const { value: resultValue } = parseJs({
    jsFunction: customJs!,
    valueWhenError: undefined,
    dependencies: [store, value, prevFunctionReturn],
    dependenciesString: ['store', 'value', 'prevFunctionReturn'],
  });
  return resultValue;
};

// 表单校验
export const triggerValidate = async (params: TEmitData) => {
  const { validateField, sourceId } = params;
  const store = dynamicGetStore();

  const element = store.getElement(sourceId!);
  if (!element) return;

  const { fieldName, id } = element;

  const fields =
    validateField === EValidateType.CURRENT ? [fieldName! || id!] : undefined;
  return store.formInstance?.validateFields(fields) as Promise<any>;
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
