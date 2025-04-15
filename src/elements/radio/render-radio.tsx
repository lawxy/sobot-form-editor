import React, { useMemo } from 'react';
import { Radio, type RadioChangeEvent } from '@sobot/soil-ui';

import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';

export const RenderRadio: TElementRender = ({
  fieldValue,
  element,
  customStyle,
  setFieldValue,
}) => {
  const { useGroup, valueOptions, direction } = element;

  const { eventFunctions } = useRegisterEvents(element);

  const onChange = (e: RadioChangeEvent) => {
    setFieldValue(e.target.value);
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  const radioOptions = useMemo(() => {
    return valueOptions?.map((opt) => ({
      ...opt,
      label: opt.label.langText,
    }));
  }, [valueOptions]);

  return useGroup ? (
    <Radio.Group
      onChange={onChange}
      value={fieldValue}
      style={customStyle}
      direction={direction}
      options={radioOptions}
    />
  ) : (
    <>
      {radioOptions?.map((opt) => (
        <Radio key={opt.id} value={opt.value}>
          {opt.label}
        </Radio>
      ))}
    </>
  );
};
