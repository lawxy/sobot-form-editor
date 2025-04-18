import React, { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { Form, FormInstance, FormProps } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import c from 'classnames';
import { prefixCls } from './const';
import { TMode } from './types';
import store from './store';

const FormContent: FC<PropsWithChildren<{ className?: string, form: FormInstance, mode: TMode }>> = ({
  children,
  className,
  form,
  mode,
}) => {
  useEffect(() => {
    store.setForm(form);
  }, [form]);

  const { extendForm } = store.getFormAttrs();

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

  const { layout } = store.editorAttrs;

  const formProps = useMemo(() => {
    const props: FormProps = {
      layout,
    };
    if (extendForm && typeof extendForm === 'object') {
      Object.assign(props, extendForm);
    } 
    return props;
  }, [extendForm, layout]);

  return (
    <Form form={form} {...formProps}>
      <div className={formClassName}>{children}</div>
    </Form>
  );
};

export const FormComponent = observer(FormContent);
