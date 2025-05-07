import { useImperativeHandle } from 'react';
import { withPromise } from '@/utils';
import store from '@/store';
import { IEditorInstance } from '@/types';
import { TElementSearch } from '@/types';
import { FormProps, FormItemProps, FormInstance } from '@sobot/soil-ui';
import { triggerService, triggerLinkingService } from '@/utils';

export const useExpose = (
  ref: React.RefObject<IEditorInstance>,
  others: { form: FormInstance },
) => {
  useImperativeHandle(ref, () => ({
    ...others,

    extendServiceEmitter: store.extendServiceEmitter,

    triggerService,

    triggerLinkingService,

    extendFormAttr(key: keyof FormProps, value: any) {
      store.setFormExtendAttr(key, value);
    },

    extendFormAttrs(extend: Record<string, any>) {
      store.setFormExtendAttrs(extend);
    },

    extendFormItemAttr(
      search: TElementSearch,
      key: keyof FormItemProps,
      value: any,
    ) {
      withPromise(() => {
        const element = store.getElement(search);
        if (element) {
          store.setFormItemExtendAttr(element.id!, key, value);
        }
      });
    },

    extendFormItemAttrs(search: TElementSearch, extend: Record<string, any>) {
      withPromise(() => {
        const element = store.getElement(search);
        if (element) {
          store.setFormItemExtendAttrs(element.id!, extend);
        }
      });
    },
    // 扩展表单元素属性
    extendElementAttr(search: TElementSearch, key: string, value: any) {
      withPromise(() => {
        const element = store.getElement(search);
        if (element) {
          store.setElementExtendAttr(element.id!, key, value);
        }
      });
    },

    extendElementAttrs(search: TElementSearch, extend: Record<string, any>) {
      withPromise(() => {
        const element = store.getElement(search);
        if (element) {
          store.setElementExtendAttrs(element.id!, extend);
        }
      });
    },

    getFieldValue(field: string) {
      return store.getFieldValue(field);
    },

    getFieldsValue() {
      return store.getFieldsValue();
    },

    setFieldValue(field: string, value: any) {
      store.setFieldValue(field, value);
    },

    setFieldsValue(values: Record<string, any>) {
      store.setFieldsValue(values);
    },

    getElement(search?: TElementSearch) {
      return withPromise(() => store.getElement(search));
    },

    getSchema() {
      return store.getSchema();
    },

  }));
};
