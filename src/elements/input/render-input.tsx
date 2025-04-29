import React, { useMemo } from 'react';
import { Input } from '@sobot/soil-ui';
import { useGetEventFunctions, useFormUpdate, useValueImmediately } from '@/hooks';
import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';
import { isUndefined } from 'lodash-es';

export const RenderInput: TElementRender = ({
  fieldValue,
  element = {},
  customStyle,
  setFieldValue,
  extendProps,
}) => {
  const {
    textType,
    minRows,
    maxRows,
    id,
    autoSize,
    placeholder,
    allowClear,
    disabled,
    showCount,
    minNum,
    maxNum,
    addonBefore,
    addonAfter,
    defaultValue,
  } = element;

  const { eventFunctions, immediateFunctions } = useGetEventFunctions(element);

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

  const inputValue = useMemo(() => {
    if (isUndefined(fieldValue)) {
      return defaultValue?.langText;
    }
    return fieldValue;
  }, [fieldValue, defaultValue]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(inputValue);
  }, [inputValue]);

  useValueImmediately(immediateFunctions, inputValue);

  return (
    <>
      {textType === 'multiple' ? (
        <Input.TextArea
          autoSize={
            autoSize
              ? { minRows: 1 }
              : {
                  minRows,
                  maxRows,
                }
          }
          value={inputValue}
          placeholder={placeholder?.langText}
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
          {...extendProps}
        />
      ) : (
        <Input
          placeholder={placeholder?.langText}
          id={id}
          onChange={handleChange}
          onFocus={handleEvent(EEventAction.ON_FOCUS)}
          onBlur={handleEvent(EEventAction.ON_BLUR)}
          value={inputValue}
          type={textType === 'single' ? 'text' : 'password'}
          autoComplete="new-password"
          allowClear={allowClear}
          style={customStyle}
          disabled={disabled}
          showCount={showCount}
          minLength={minNum}
          maxLength={maxNum}
          addonBefore={addonBefore?.langText}
          addonAfter={addonAfter?.langText}
          {...extendProps}
        />
      )}
    </>
  );
};
