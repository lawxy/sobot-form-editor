import React, { useMemo } from 'react';
import { Radio, type RadioChangeEvent } from '@sobot/soil-ui';
import { isUndefined } from 'lodash-es';
import { parseText } from '@/utils';
import { useGetEventFunctions, useFormUpdate, useValueImmediately } from '@/hooks';
import { EEventAction } from '@/types';
import type { TElementRender, TOption } from '@/types';

export const RenderRadio: TElementRender = ({
  fieldValue,
  element,
  customStyle,
  setFieldValue,
  extendProps,
}) => {
  const { useGroup, options, direction, defaultValue } = element;

  const { eventFunctions, immediateFunctions } = useGetEventFunctions(element);

  const onChange = (e: RadioChangeEvent) => {
    setFieldValue(e.target.value);
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  const radioOptions = useMemo(() => {
    const iterateOptions = extendProps?.options || options;
    return iterateOptions?.map((opt: TOption) => ({
      ...opt,
      label: parseText(opt.label),
    }));
  }, [options, extendProps?.options]);

  const radioValue = useMemo(() => {
    if (isUndefined(fieldValue)) {
      return defaultValue;
    }
    return fieldValue;
  }, [fieldValue, defaultValue]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(radioValue);
  }, [radioValue]);

  useValueImmediately(immediateFunctions, radioValue);

  return useGroup ? (
    <Radio.Group
      onChange={onChange}
      value={radioValue}
      style={customStyle}
      direction={direction}
      {...extendProps}
      options={radioOptions}
    />
  ) : (
    <>
      {radioOptions?.map((opt: TOption) => (
        <Radio key={opt.id} value={opt.value} style={customStyle}>
          {parseText(opt.label)}
        </Radio>
      ))}
    </>
  );
};
