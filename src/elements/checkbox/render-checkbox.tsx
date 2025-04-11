import React from 'react';
import { Checkbox, Space } from '@sobot/soil-ui';

import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { EEventAction, type TElementRender } from '@/types';

export const RenderCheckbox: TElementRender = ({
  fieldValue,
  element,
  customStyle,
  setFieldValue,
}) => {
  const { useGroup, valueOptions, alignDirection, indeterminate } = element;

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

  return useGroup ? (
    <Checkbox.Group
      onChange={handleChange}
      value={fieldValue}
      style={customStyle}
      direction={alignDirection}
      options={valueOptions}
    />
  ) : (
    <>
      {valueOptions?.map((opt) => (
        <Checkbox key={opt.id} value={opt.value} indeterminate={indeterminate}>
          {opt.label}
        </Checkbox>
      ))}
    </>
  );
};
