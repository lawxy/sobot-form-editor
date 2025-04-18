import { cloneDeep, result } from 'lodash-es';
import {
  EEventType,
  EChangeStatePayload,
  TFormSerive,
  ELinkRefreshType,
  type IBaseElement,
} from '@/types';
import { dynamicGetStore } from '.';
import { triggerService } from './trigger-service';
import type { TEmitData } from './handle-emit-event';

// 设置组件
export const triggerSettingValue = (params: TEmitData) => {
  const { setValue, value, targetPayload, targetElementId } = params;
  const store = dynamicGetStore();
  if (!store.getElement(targetElementId!)) return;
  switch (targetPayload) {
    case EChangeStatePayload.SYNC:
      return store.setFieldValue(targetElementId!, value);
    case EChangeStatePayload.CUSTOM:
      return store.setFieldValue(targetElementId!, setValue);
    case EChangeStatePayload.RESET_PAGE:
      return store.setElementProp(targetElementId!, 'currentPage', 1);
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
  // 清空参数
  if (targetPayload === EChangeStatePayload.CLEAR) {
    store.setService(servId, { data: {}, params: {} });
  }
  // 提交表单
  if (targetPayload === EChangeStatePayload.SUBMIT) {
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
            linkRefreshType === ELinkRefreshType.VALUEOPTIONS
              ? ELinkRefreshType.VALUEOPTIONS
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

export const handleOnEvent = async (params: TEmitData) => {
  const { eventType } = params;
  switch (eventType) {
    case EEventType.SETTING_VALUE:
      await triggerSettingValue(params);
      break;
    case EEventType.UPDATE_SERVICE:
      await triggerRefreshService(params);
      break;
  }
};
