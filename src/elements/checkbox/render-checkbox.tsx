import React, { useMemo } from 'react';
import { Checkbox, Space } from '@sobot/soil-ui';

import { useGetEventFunctions, useFormUpdate } from '@/hooks';
import { EEventAction, type TElementRender } from '@/types';
import { isUndefined } from 'lodash-es';

export const RenderCheckbox: TElementRender = ({
  fieldValue,
  element,
  customStyle,
  setFieldValue,
  extendProps,
}) => {
  const { useGroup, options, direction, indeterminate, defaultValue } = element;

  const { eventFunctions } = useGetEventFunctions(element);

  const handleChange = (val: Array<string | number | boolean>) => {
    setFieldValue(val);
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  const checkboxOptions = useMemo(() => {
    return options?.map((opt) => ({
      ...opt,
      label: opt.label.langText,
    }));
  }, [options]);

  const checkboxValue = useMemo(() => {
    if (isUndefined(fieldValue)) {
      return defaultValue;
    }
    return fieldValue;
  }, [fieldValue, defaultValue]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(checkboxValue);
  }, [checkboxValue]);

  return useGroup ? (
    <Checkbox.Group
      onChange={handleChange}
      value={checkboxValue}
      style={customStyle}
      direction={direction}
      options={checkboxOptions}
      {...extendProps}
    />
  ) : (
    <>
      {checkboxOptions?.map((opt) => (
        <Checkbox
          key={opt.id}
          value={opt.value}
          indeterminate={indeterminate}
          style={customStyle}
        >
          {opt.label}
        </Checkbox>
      ))}
    </>
  );
};
