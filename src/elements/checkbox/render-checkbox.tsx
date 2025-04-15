import React, { useMemo } from 'react';
import { Checkbox, Space } from '@sobot/soil-ui';

import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { EEventAction, type TElementRender } from '@/types';

export const RenderCheckbox: TElementRender = ({
  fieldValue,
  element,
  customStyle,
  setFieldValue,
}) => {
  const { useGroup, valueOptions, direction, indeterminate } = element;

  const { eventFunctions } = useRegisterEvents(element);

  const handleChange = (val: Array<string | number | boolean>) => {
    setFieldValue(val);
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  const checkboxOptions = useMemo(() => {
    return valueOptions?.map((opt) => ({
      ...opt,
      label: opt.label.langText,
    }));
  }, [valueOptions]);

  return useGroup ? (
    <Checkbox.Group
      onChange={handleChange}
      value={fieldValue}
      style={customStyle}
      direction={direction}
      options={checkboxOptions}
    />
  ) : (
    <>
      {checkboxOptions?.map((opt) => (
        <Checkbox key={opt.id} value={opt.value} indeterminate={indeterminate}>
          {opt.label}
        </Checkbox>
      ))}
    </>
  );
};
