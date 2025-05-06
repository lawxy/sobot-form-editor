import React from 'react';
import { Input } from '@sobot/soil-ui';
import { useGetEventFunctions, useFormUpdate } from '@/hooks';
import { parseText } from '@/utils';
import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';

export const RenderSearch: TElementRender = ({
  fieldValue,
  element = {},
  customStyle,
  setFieldValue,
  extendProps,
}) => {
  const { id, placeholder, allowClear, disabled } = element;

  const { eventFunctions } = useGetEventFunctions(element);

  const handleEvent =
    (action: EEventAction) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      eventFunctions[action]?.(e.target.value);
    };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFieldValue(e.target.value);
  };

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    eventFunctions[EEventAction.ON_SEARCH]?.(e.target.value);
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  return (
    <Input.Search
      placeholder={parseText(placeholder)}
      id={id}
      // @ts-ignore
      onSearch={handleSearch}
      onChange={handleChange}
      onFocus={handleEvent(EEventAction.ON_FOCUS)}
      onBlur={handleEvent(EEventAction.ON_BLUR)}
      value={fieldValue}
      allowClear={allowClear}
      style={customStyle}
      disabled={disabled}
      {...extendProps}
    />
  );
};
