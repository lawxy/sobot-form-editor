import React from 'react';
import { DatePicker } from '@sobot/soil-ui';
import moment from 'moment';
import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { formatDate } from '@/utils';
import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';
import { showTimeFormat } from './const';

export const RenderDate: TElementRender = ({
  fieldValue,
  element,
  customStyle,
  setFieldValue,
}) => {
  const { dateFormat, placeholder, allowClear, addonBefore, datePickerType, showTime } = element;

  const { eventFunctions } = useRegisterEvents(element);

  const handleEvent = (action: EEventAction) => (e: any) => {
    eventFunctions[action]?.(e.target.value);
  };

  const handleChange = (date: Date) => {
    // console.log('date', date)
    setFieldValue(date ? formatDate(date, dateFormat!) : undefined);
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);
 
  return (
    <DatePicker
      // format={dateFormat}
      // @ts-ignore
      value={fieldValue ? moment(fieldValue, dateFormat) : undefined}
      // showTime={showTimeFormat(dateFormat!)}
      showTime={showTime}
      getPopupContainer={(n: any) => n.parentElement}
      placement="bottomRight"
      onChange={handleChange}
      onFocus={handleEvent(EEventAction.ON_FOCUS)}
      onBlur={handleEvent(EEventAction.ON_BLUR)}
      placeholder={placeholder}
      allowClear={allowClear}
      style={customStyle}
      label={addonBefore}
      picker={datePickerType}
    />
  );
};
