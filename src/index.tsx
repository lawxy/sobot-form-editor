import React, { useEffect, useMemo, useImperativeHandle } from 'react';
import type { PropsWithChildren } from 'react';
import { ConfigProvider, Form, FormItemProps, FormProps } from '@sobot/soil-ui';
import type { I18nLang } from '@sobot/utils/es/i18n';

import 'reflect-metadata';
import 'moment/locale/zh-cn';

import c from 'classnames';
import { IBaseStore } from './store/types';
import { ElementsMap } from './elements';
import type { IBaseElement, IFormSchema, TDragElement, TElementSearch } from './types';
import { prefixCls } from './const';
import store from './store';
import { injectSchema } from '.';
import { EditorContext, type IEditorContext } from './context';
import { wrapObserver } from './utils';
import { FormComponent } from './form';

import './index.less';

export * from './types';
export * from './views';
export * from './const';
export * from './utils';
export * from './hooks';
export * from './components';
export * from './context';

export interface IEditorInstance {
  getSchema: IBaseStore['getSchema'];
  getFieldValue: IBaseStore['getFieldValue'];
  getFieldValues: IBaseStore['getFieldValues'];
  setFieldValue: IBaseStore['setFieldValue'];
  setFieldsValue: IBaseStore['setFieldsValue'];
  getElement: IBaseStore['getElement'];
  // 前端扩展
  extendForm: (extend: FormProps) => void;
  extendFormItem: (search: TElementSearch, extend: FormItemProps) => void;
  extendElement: (search: TElementSearch, extend: Record<string, any>) => void;
}

export type TFormProps = {
  defaultValue?: IFormSchema;
  customElements?: TDragElement;
  lang?: I18nLang;
  className?: string;
  // LOCALE?: Record<string, string>;
  extend?: Record<string, any>;
} & Pick<IEditorContext, 'mode' | 'actionProp' | 'LOCALE'>;

const FormEditorContent: React.ForwardRefRenderFunction<
  IEditorInstance,
  PropsWithChildren<TFormProps>
> = (
  {
    mode,
    defaultValue,
    actionProp,
    customElements,
    lang,
    children,
    className,
    LOCALE,
  },
  ref,
) => {
  const [form] = Form.useForm();

  useEffect(() => {
    store.setForm(form);
  }, [form]);

  useEffect(() => {
    let schema: IFormSchema = {};
    try {
      if (defaultValue) {
        if (typeof defaultValue === 'string') {
          schema = JSON.parse(defaultValue);
        } else if (typeof defaultValue === 'object') {
          schema = defaultValue;
        }
      } else if (localStorage.getItem('schema')) {
        schema = JSON.parse(localStorage.getItem('schema')!);
      }
    } catch (e) {
      schema = {};
    }
    injectSchema(schema);
  }, [defaultValue]);

  useImperativeHandle(ref, () => ({
    setElementProp(search: TElementSearch, field: keyof IBaseElement, value: any) {
      Promise.resolve().then(() => {
        const element = store.getElement(search);
        if (element) {
          store.setElementProp(element.id!, field, value);
        }
      })
    },
    extendForm(extend: FormProps) {
      store.setFormAttr('extendForm', extend);
    },
    extendFormItem(search: TElementSearch, extend: FormItemProps) {
      Promise.resolve().then(() => {
        const element = store.getElement(search);
        if (element) {
          store.setElementProp(element.id!, 'extendFormItem', extend);
        }
      })
    },
    extendElement(search: TElementSearch, extend: Record<string, any>) {
      Promise.resolve().then(() => {
        const element = store.getElement(search);
        if (element) {
          store.setElementProp(element.id!, 'extendProps', extend);
        }
      })
    },
    getFieldValue(field: string) {
      return store.getFieldValue(field);
    },
    getFieldValues() {
      return store.getFieldValues();
    },
    setFieldValue(field: string, value: any) {
      Promise.resolve().then(() => {
        store.setFieldValue(field, value);
      })
    },
    setFieldsValue(values: Record<string, any>) {
      Promise.resolve().then(() => {
        store.setFieldsValue(values);
      })
    },
    getElement(search?: string | { id?: string, fieldName?: string }) {
      return Promise.resolve().then(() => store.getElement(search));
    },
    getSchema() {
      return store.getSchema();
    },
  }));

  const contextValue = useMemo(() => {
    Object.assign(
      wrapObserver(ElementsMap),
      wrapObserver(customElements || {}, true),
    );

    return {
      mode,
      actionProp,
      ElementsMap,
      LOCALE: LOCALE || {},
    };
  }, [mode, actionProp, customElements, ElementsMap, LOCALE]);

  const formClassName = useMemo(() => {
    const classObj = {
      [prefixCls('form')]: true,
      [prefixCls('form-design')]: mode === 'design',
    };
    if (className) {
      Object.assign(classObj, className);
    }
    return c(classObj);
  }, [className, mode]);

  return (
    <EditorContext.Provider value={contextValue}>
      <ConfigProvider lang={lang || 'zh'}>
        <FormComponent mode={mode} form={form} className={formClassName}>{children}</FormComponent>
      </ConfigProvider>
    </EditorContext.Provider>
  );
};

export const FormEditor = React.forwardRef<
  IEditorInstance,
  PropsWithChildren<TFormProps>
>(FormEditorContent);
