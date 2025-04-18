import React, { useMemo } from 'react';
import { InputNumber } from '@sobot/soil-ui';
import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';
import { EValueType } from './const';
import { isUndefined } from 'lodash-es';

export const RenderNumber: TElementRender = ({
  element = {},
  fieldValue,
  customStyle,
  setFieldValue,
}) => {
  const { id, minNum, maxNum, valueType, defaultValue, extendProps } = element;
  const { eventFunctions } = useRegisterEvents(element);

  const [precision, step] = useMemo(() => {
    switch (valueType) {
      case EValueType.INT:
        return [0, 1];
      case EValueType.ONE_DECIMAL:
        return [1, 0.1];
      // case EValueType.TWO_DECIMAL:
      default:
        return [2, 0.01];
    }
  }, [valueType]);

  const handleEvent =
    (action: EEventAction) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      eventFunctions[action]?.(e.target.value);
    };

  const handleChange = (val: number | null) => {
    setFieldValue(val);
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  const inputValue = useMemo(() => {
    if (isUndefined(fieldValue)) {
      return defaultValue;
    }
    return fieldValue;
  }, [fieldValue, defaultValue]);

  return (
    <InputNumber
      value={inputValue}
      id={id}
      onChange={handleChange}
      onFocus={handleEvent(EEventAction.ON_FOCUS)}
      onBlur={handleEvent(EEventAction.ON_BLUR)}
      min={minNum}
      max={maxNum}
      precision={precision}
      step={step}
      style={customStyle}
      {...extendProps}
    />
  );
};
