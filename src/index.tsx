import React, { useEffect, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import {
  ConfigProvider,
  Form,
  FormItemProps,
  FormProps,
  type FormInstance,
} from '@sobot/soil-ui';
import type { I18nLang } from '@sobot/utils/es/i18n';

import 'reflect-metadata';
import 'moment/locale/zh-cn';

import c from 'classnames';
import { HeaderActionPane } from './views/header-action-pane';
import { IBaseStore } from './store/types';
import { ElementsMap } from './elements';
import type {
  IBaseElement,
  IExtendStore,
  IFormSchema,
  TDragElement,
  TElementSearch,
} from './types';
import { prefixCls } from './const';
import store from './store';
import { injectSchema } from '.';
import { EditorContext, type IEditorContext } from './context';
import { wrapObserver } from './utils';
import { FormComponent } from './form';
import { useExpose } from './hooks';
import './index.less';

export * from './types';
export * from './views';
export * from './elements'
export * from './const';
export * from './utils';
export * from './hooks';
export * from './components';
export * from './context';
export interface IEditorInstance {
  getSchema: IBaseStore['getSchema'];
  getElement: (search?: TElementSearch) => Promise<IBaseElement | undefined>;

  // 表单
  form: FormInstance;
  getFieldValue: IBaseStore['getFieldValue'];
  getFieldsValue: IBaseStore['getFieldsValue'];
  setFieldValue: IBaseStore['setFieldValue'];
  setFieldsValue: IBaseStore['setFieldsValue'];
  // 扩展
  extendServiceEmitter: IExtendStore['extendServiceEmitter'];
  extendFormAttr: (key: keyof FormProps, value: any) => void;
  extendFormAttrs: (extend: FormProps) => void;
  extendFormItemAttr: (
    search: TElementSearch,
    key: keyof FormItemProps,
    value: any,
  ) => void;
  extendFormItemAttrs: (search: TElementSearch, extend: FormItemProps) => void;
  extendElementAttr: (search: TElementSearch, key: string, value: any) => void;
  extendElementAttrs: (
    search: TElementSearch,
    extend: Record<string, any>,
  ) => void;
}

export type TFormProps = {
  defaultValue?: IFormSchema;
  customElements?: TDragElement;
  lang?: I18nLang;
  className?: string;
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
    if(LOCALE) {
      store.setLocale(LOCALE);
    }
  }, [form, LOCALE]);

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

  useExpose(ref, {
    form,
  });

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
          <HeaderActionPane />
          <FormComponent mode={mode} form={form} className={formClassName}>
            {children}
          </FormComponent>
      </ConfigProvider>
    </EditorContext.Provider>
  );
};

export const FormEditor = React.forwardRef<
  IEditorInstance,
  PropsWithChildren<TFormProps>
>(FormEditorContent);
