import React, { useMemo } from 'react';
import { TimePicker } from '@sobot/soil-ui';
import moment from 'moment';
import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { EDateMode, EEventAction } from '@/types';
import type { TElementRender } from '@/types';

export const RenderTime: TElementRender = ({
  fieldValue,
  element,
  customStyle,
  setFieldValue,
}) => {
  const {
    dateFormat,
    placeholder,
    allowClear,
    addonBefore,
    timeRange,
    startPlaceholder,
    endPlaceholder,
    disabled,
    startDateMode,
    endDateMode,
    startDate,
    endDate,
  } = element;

  const { eventFunctions } = useRegisterEvents(element);

  const handleEvent = (action: EEventAction) => (e: any) => {
    eventFunctions[action]?.(e.target.value);
  };

  const handleChange = (date: any) => {
    if (!date) {
      setFieldValue(null);
      return;
    }
    if (Array.isArray(date)) {
      setFieldValue(date.map((item) => moment(item)));
    } else {
      setFieldValue(moment(date));
    }
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  const Time = useMemo(() => {
    const Component = timeRange ? TimePicker.RangePicker : TimePicker;

    const _placeholder = timeRange
      ? [startPlaceholder?.langText, endPlaceholder?.langText]
      : placeholder?.langText;

    return {
      Component,
      placeholder: _placeholder,
    };
  }, [timeRange, startPlaceholder, endPlaceholder, placeholder]);

  const value = useMemo(() => {
    // 表单有值
    if (typeof fieldValue === 'object') {
      if (fieldValue === null) {
        return undefined;
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.map((item) => (item ? moment(item) : undefined));
      }
      return fieldValue ? moment(fieldValue) : undefined;
    }

    // 表单无值 走配置
    if (timeRange) {
      const start =
        startDateMode === EDateMode.NOW
          ? moment()
          : startDate
          ? moment(startDate)
          : undefined;

      const end =
        endDateMode === EDateMode.NOW
          ? moment()
          : endDate
          ? moment(endDate)
          : undefined;

      return [start, end];
    }

    return startDateMode === EDateMode.NOW
      ? moment()
      : startDate
      ? moment(startDate)
      : undefined;
  }, [
    fieldValue,
    timeRange,
    dateFormat,
    startDateMode,
    endDateMode,
    startDate,
    endDate,
  ]);

  return (
    <Time.Component
      format={dateFormat}
      onChange={handleChange}
      onFocus={handleEvent(EEventAction.ON_FOCUS)}
      onBlur={handleEvent(EEventAction.ON_BLUR)}
      value={value as any}
      placeholder={Time.placeholder as any}
      allowClear={allowClear}
      style={customStyle}
      label={addonBefore?.langText}
      disabled={disabled}
    />
  );
};
