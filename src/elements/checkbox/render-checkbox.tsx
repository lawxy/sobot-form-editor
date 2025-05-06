import React, { useMemo } from 'react';
import { Checkbox } from '@sobot/soil-ui';

import { useGetEventFunctions, useFormUpdate, useValueImmediately } from '@/hooks';
import { EEventAction, TOption, type TElementRender } from '@/types';
import { isUndefined } from 'lodash-es';
import { parseText } from '@/utils';

export const RenderCheckbox: TElementRender = ({
  fieldValue,
  element,
  customStyle,
  setFieldValue,
  extendProps,
}) => {
  const { useGroup, options, direction, indeterminate, defaultValue } = element;

  const { eventFunctions, immediateFunctions } = useGetEventFunctions(element);

  const handleChange = (val: Array<string | number | boolean>) => {
    setFieldValue(val);
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  const checkboxOptions = useMemo(() => {
    const iterateOptions = extendProps?.options || options;

    return iterateOptions?.map((opt: TOption) => ({
      ...opt,
      label: parseText(opt.label),
    }));
  }, [options, extendProps?.options]);

  const checkboxValue = useMemo(() => {
    if (isUndefined(fieldValue)) {
      return defaultValue;
    }
    return fieldValue;
  }, [fieldValue, defaultValue]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(checkboxValue);
  }, [checkboxValue]);

  useValueImmediately(immediateFunctions, checkboxValue);

  return useGroup ? (
    <Checkbox.Group
      onChange={handleChange}
      value={checkboxValue}
      style={customStyle}
      direction={direction}
      {...extendProps}
      options={checkboxOptions}
    />
  ) : (
    <>
      {checkboxOptions?.map((opt: TOption) => (
        <Checkbox
          key={opt.id}
          checked={checkboxValue?.includes(opt.value)}
          indeterminate={indeterminate}
          style={customStyle}
          onChange={(e) => {
            const value = Array.isArray(checkboxValue) ? [...checkboxValue] : [];
            handleChange(e.target.checked ? [...value, opt.value] : value.filter((val: string | number | boolean) => val !== opt.value));
          }}
        >
          {opt.label}
        </Checkbox>
      ))}
    </>
  );
};
