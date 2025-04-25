import React, { useMemo } from 'react';
import { DatePicker } from '@sobot/soil-ui';
import moment, { type Moment } from 'moment';
import { assign } from 'lodash';
import { useGetEventFunctions, useFormUpdate } from '@/hooks';
import { EEventAction, EDateMode } from '@/types';
import type { TElementRender } from '@/types';
import { parseJs, showTimeFormat } from '@/utils';

export const RenderDate: TElementRender = ({
  fieldValue,
  element,
  customStyle,
  setFieldValue,
  extendProps,
}) => {
  const {
    dateFormat,
    placeholder,
    allowClear,
    addonBefore,
    datePickerType,
    placement,
    startDateMode,
    startDate,
    startDateCustom,
    disabled,
  } = element;

  const { eventFunctions } = useGetEventFunctions(element);

  const handleEvent = (action: EEventAction) => (e: any) => {
    eventFunctions[action]?.(e.target.value);
  };

  const handleChange = (date: Moment | null) => {
    // setFieldValue(date ? moment(date) : 'null');
    setFieldValue(date && moment(date));
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  const value = useMemo(() => {
    // 表单值有值(null也算有值) - 表示这是人为操作过的表单
    if (typeof fieldValue === 'object') {
      return fieldValue !== null ? moment(fieldValue) : undefined;
    }
    // 其次走配置里的默认值
    if (startDateMode === EDateMode.NOW) {
      return moment();
    }

    if (startDateMode === EDateMode.PICKER) {
      return startDate ? moment(startDate) : undefined;
    }

    if (startDateMode === EDateMode.CUSTOM) {
      const { value } = parseJs({
        jsFunction: startDateCustom!,
        valueWhenError: undefined,
        // dependencies: [moment],
        // dependenciesString: ['moment'],
      });
      return value ? moment(value) : undefined;
    }

    return undefined;
  }, [startDateMode, startDate, dateFormat, startDateCustom, fieldValue]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(value);
  }, [value]);

  const attributes = useMemo(() => {
    const baseAttributes = {
      label: addonBefore?.langText,
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
    <DatePicker
      value={value}
      getPopupContainer={(n: any) => n.parentElement}
      onChange={handleChange}
      onFocus={handleEvent(EEventAction.ON_FOCUS)}
      onBlur={handleEvent(EEventAction.ON_BLUR)}
      disabled={disabled}
      allowClear={allowClear}
      placeholder={placeholder?.langText}
      style={customStyle}
      {...attributes}
      {...extendProps}
    />
  );
};
