import React, { useMemo } from 'react';
import { DatePicker } from '@sobot/soil-ui';
import moment, { type Moment } from 'moment';
import { assign } from 'lodash';
import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { EEventAction, EDateMode } from '@/types';
import type { TElementRender } from '@/types';
import { parseJs, showTimeFormat } from '@/utils';

const { RangePicker, RangePickerV2 } = DatePicker;

export const RenderDateRange: TElementRender = ({
  fieldValue,
  element,
  customStyle,
  setFieldValue,
}) => {
  const {
    dateFormat,
    allowClear,
    addonBefore,
    datePickerType,
    placement,
    startDateMode,
    startDate,
    startDateCustom,
    disabled,
    startPlaceholder,
    endPlaceholder,
    endDateMode,
    endDate,
    endDateCustom,
  } = element;

  const { eventFunctions } = useRegisterEvents(element);

  const handleEvent = (action: EEventAction) => (e: any) => {
    eventFunctions[action]?.(e.target.value);
  };

  const handleChange = (date: Moment | null) => {
    setFieldValue(date ? moment(date) : 'null');
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  const value = useMemo(() => {
    // 表单值有值(null也算有值) - 表示这是人为操作过的表单
    if (fieldValue) {
      if (fieldValue === 'null') return undefined;
      return fieldValue?.map((item: Moment | null) =>
        item ? moment(item) : undefined,
      );
    }

    // 其次走配置里的默认值
    let startValue = undefined;
    let endValue = undefined;

    if (startDateMode === EDateMode.NOW) {
      startValue = moment();
    }

    if (startDateMode === EDateMode.PICKER) {
      startValue = startDate ? moment(startDate) : undefined;
    }

    if (startDateMode === EDateMode.CUSTOM) {
      const { value } = parseJs({
        jsFunction: startDateCustom!,
        valueWhenError: undefined,
        dependencies: [moment],
        dependenciesString: ['moment'],
      });
      startValue = value ? moment(value) : undefined;
    }

    if (endDateMode === EDateMode.NOW) {
      endValue = moment();
    }

    if (endDateMode === EDateMode.PICKER) {
      endValue = endDate ? moment(endDate) : undefined;
    }

    if (endDateMode === EDateMode.CUSTOM) {
      const { value } = parseJs({
        jsFunction: endDateCustom!,
        valueWhenError: undefined,
        dependencies: [moment],
        dependenciesString: ['moment'],
      });
      endValue = value ? moment(value) : undefined;
    }

    return [startValue, endValue];
  }, [
    startDateMode,
    startDate,
    dateFormat,
    startDateCustom,
    endDateMode,
    endDate,
    endDateCustom,
    fieldValue,
  ]);

  const attributes = useMemo(() => {
    const baseAttributes = {
      label: addonBefore,
      placement,
    };

    if (datePickerType === '') {
      return assign(baseAttributes, {
        format: dateFormat,
        showTime: showTimeFormat(dateFormat!),
      });
    }

    return assign(baseAttributes, {
      picker: datePickerType,
    });
  }, [dateFormat, addonBefore, datePickerType, placement]);

  return (
    <RangePicker
      value={value}
      // onChange={handleChange}
      onFocus={handleEvent(EEventAction.ON_FOCUS)}
      onBlur={handleEvent(EEventAction.ON_BLUR)}
      disabled={disabled}
      allowClear={allowClear}
      style={customStyle}
      placeholder={[startPlaceholder!, endPlaceholder!]}
      {...attributes}
    />
  );
};
