import { useImperativeHandle } from 'react';
import { withPromise } from '@/utils';
import store from '@/store';
import eventRelationStore from '@/store/eventRelationStore';
import { IBaseElement } from '@/types';
import { TElementSearch } from '@/types';
import { FormProps, FormItemProps } from '@sobot/soil-ui';
import { IEditorInstance } from '@sobot/form-editor';

export const useExpose = (
  ref: React.RefObject<IEditorInstance>,
  others: Record<string, any>,
) => {
  useImperativeHandle(ref, () => ({
    ...others,

    extendServiceEmitter: store.extendServiceEmitter,

    // setElementProp(
    //   search: TElementSearch,
    //   field: keyof IBaseElement,
    //   value: any,
    // ) {
    //   withPromise(() => {
    //     const element = store.getElement(search);
    //     if (element) {
    //       store.setElementProp(element.id!, field, value);
    //     }
    //   });
    // },

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
