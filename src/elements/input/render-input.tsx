import React from 'react';
import { Input } from '@sobot/soil-ui';
import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';

export const RenderInput: TElementRender = ({
  fieldValue,
  element = {},
  customStyle,
  setFieldValue,
}) => {
  const { textType, minRows, maxRows, id, autoSize, placeholder, allowClear, disabled, showCount, minNum, maxNum, addonBefore, addonAfter } =
    element;

  const { eventFunctions } = useRegisterEvents(element);


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

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  return (
    <>
      {textType === 'multiple' ? (
        <Input.TextArea
          autoSize={
            autoSize
              ? {minRows: 1}
              : {
                  minRows,
                  maxRows,
                }
          }
          value={fieldValue}
          placeholder={placeholder}
          id={id}
          onChange={handleChange}
          onFocus={handleEvent(EEventAction.ON_FOCUS)}
          onBlur={handleEvent(EEventAction.ON_BLUR)}
          allowClear={allowClear}
          style={customStyle}
          disabled={disabled}
          showCount={showCount}
          minLength={minNum}
          maxLength={maxNum}
        />
      ) : (
        <Input
          placeholder={placeholder}
          id={id}
          onChange={handleChange}
          onFocus={handleEvent(EEventAction.ON_FOCUS)}
          onBlur={handleEvent(EEventAction.ON_BLUR)}
          value={fieldValue}
          type={textType === 'single' ? 'text' : 'password'}
          autoComplete="new-password"
          allowClear={allowClear}
          style={customStyle}
          disabled={disabled}
          showCount={showCount}
          minLength={minNum}
          maxLength={maxNum}
          addonBefore={addonBefore}
          addonAfter={addonAfter}
        />
      )}
    </>
  );
};
