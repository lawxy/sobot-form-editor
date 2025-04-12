import React, { useEffect, useMemo, useImperativeHandle } from 'react';
import type { PropsWithChildren } from 'react';
import { ConfigProvider, Form } from '@sobot/soil-ui';
import type { FormInstance } from 'antd';
import type { I18nLang } from '@sobot/utils/es/i18n';

import 'reflect-metadata';
import 'moment/locale/zh-cn';

import c from 'classnames';
import { ElementsMap } from './elements';
import type { IFormSchema, TDragElement } from './types';
import { prefixCls } from './const';
import store from './store';
import { injectSchema } from '.';
import { EditorContext, type IEditorContext } from './context';
import { wrapObserver } from './utils';

import './index.less';

export * from './types';
export * from './views';
export * from './const';
export * from './utils';
export * from './hooks';
export * from './components';
export * from './context'

export interface IEditorInstance {
  form: FormInstance;
  getSchema: () => void;
}

export type TFormProps = {
  defaultValue?: IFormSchema;
  customElements?: TDragElement;
  lang?: I18nLang;
  className?: string;
} & Pick<IEditorContext, 'mode' | 'actionProp'>;

const FormEditorContent: React.ForwardRefRenderFunction<
  IEditorInstance,
  PropsWithChildren<TFormProps>
> = ({ mode, defaultValue, actionProp, customElements, lang, children, className }, ref) => {
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
        }else if(typeof defaultValue === 'object') {
          schema = defaultValue
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
    form,
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
    };
  }, [mode, actionProp, customElements, ElementsMap]);

  const formClassName = useMemo(() => {
    const classObj = {
      [prefixCls('form')]: true,
      [prefixCls('form-design')]: mode === 'design',
    }
    if(className) {
      Object.assign(classObj, className);
    }
    return c(classObj);
  }, [className, mode]);

  return (
    <EditorContext.Provider value={contextValue}>
      <ConfigProvider lang={lang || 'zh'}>
          <Form form={form}>
            <div
              className={formClassName}
            >
              {children}
            </div>
          </Form>
      </ConfigProvider>
    </EditorContext.Provider>
  );
};

export const FormEditor = React.forwardRef<
  IEditorInstance,
  PropsWithChildren<TFormProps>
>(FormEditorContent);
