import React, { useMemo } from 'react';

import { DownOutlined, UpOutlined } from '@ant-design/icons';

import { getValueFromInput } from '@/utils';
import { useFormUpdate, useGetEventFunctions, useValueImmediately } from '@/hooks';
import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';
import { prefixCls } from '@/const';
import './style.less';

export const RenderText: TElementRender = ({
  element,
  customStyle,
  extendProps,
  setFieldValue,
  fieldValue
}) => {
  const { text, toggle, openValue, closeValue, defaultValue } = element;

  const { eventFunctions } = useGetEventFunctions(element);

  const realOpenValue = useMemo(() => {
    return getValueFromInput(openValue);
  }, [openValue]);

  const style = useMemo(() => {
    return {
      ...(toggle && {
        cursor: 'pointer',
      }),
      ...customStyle,
    };
  }, [customStyle, toggle]);

  
  
  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  const value = useMemo(() => {
    return fieldValue ?? getValueFromInput(defaultValue)
  }, [fieldValue, defaultValue])

  console.log('defalut', defaultValue)
  console.log('fieldValue', fieldValue)

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(value);
  }, [value]);

  useValueImmediately(element, eventFunctions, value);

  return (
    <div
      className={prefixCls('text-wrap')}
      onClick={() => {  
        setFieldValue(value === realOpenValue ? getValueFromInput(closeValue) : realOpenValue)
        eventFunctions[EEventAction.ON_CLICK]?.();
      }}
      style={style}
      {...extendProps}
    >
      {text?.langText}
      {
        toggle && (
          <>
            {
              value === realOpenValue ? (
                <UpOutlined/>
              ) : (
                <DownOutlined />
              )
            }
          </>
        )
      }
    </div>
  );
};
