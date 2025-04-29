import React, { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { Form, FormInstance } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import c from 'classnames';
import { prefixCls } from './const';
import { TMode } from './types';
import store from './store';

const FormContent: FC<
  PropsWithChildren<{ className?: string; form: FormInstance; mode: TMode }>
> = ({ children, className, form, mode }) => {
  useEffect(() => {
    store.setForm(form);
  }, [form]);

  const formClassName = useMemo(() => {
    const classObj = {
      [prefixCls('form')]: true,
      [prefixCls('form-design')]: mode === 'design',
    };
    if (className) {
      Object.assign(classObj, { [className]: true });
    }
    return c(classObj);
  }, [className, mode]);

  const { layout } = store.editorAttrs;

  const formProps = store.getFormExtendAttrs();

  return (
    <Form form={form} layout={layout} {...formProps}>
      <div className={formClassName}>{children}</div>
    </Form>
  );
};

export const FormComponent = observer(FormContent);
