import React, { useMemo } from 'react';
import { DatePicker } from '@sobot/soil-ui';
import moment, { type Moment } from 'moment';
import { assign } from 'lodash';
import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { formatDate } from '@/utils';
import { EEventAction, EDateMode } from '@/types';
import type { TElementRender } from '@/types';
import { parseJs } from '@/utils';
import { showTimeFormat } from './const';

export const RenderDate: TElementRender = ({
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
    datePickerType,
    placement,
    startDateMode,
    startDate,
    startDateCustom,
  } = element;

  const { eventFunctions } = useRegisterEvents(element);

  const handleEvent = (action: EEventAction) => (e: any) => {
    eventFunctions[action]?.(e.target.value);
  };

  const handleChange = (date: Moment | null) => {
    setFieldValue(date ? formatDate(date, dateFormat!) : 'null');
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
      return fieldValue !== 'null' ? moment(fieldValue, dateFormat) : undefined;
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
        dependencies: [moment],
        dependenciesString: ['moment'],
      });
      return value ? moment(value) : undefined;
    }

    return undefined;
  }, [startDateMode, startDate, dateFormat, startDateCustom, fieldValue]);

  const attributes = useMemo(() => {
    const baseAttributes = {
      placeholder,
      allowClear,
      customStyle,
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
  }, [
    dateFormat,
    placeholder,
    allowClear,
    addonBefore,
    datePickerType,
    placement,
    customStyle,
  ]);

  return (
    <DatePicker
      value={value}
      getPopupContainer={(n: any) => n.parentElement}
      onChange={handleChange}
      onFocus={handleEvent(EEventAction.ON_FOCUS)}
      onBlur={handleEvent(EEventAction.ON_BLUR)}
      {...attributes}
    />
  );
};
