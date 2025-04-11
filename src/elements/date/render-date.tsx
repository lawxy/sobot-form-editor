import React, { useMemo } from 'react';
import { DatePicker } from '@sobot/soil-ui';
import moment from 'moment';
import { assign } from 'lodash';
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
  const { dateFormat, placeholder, allowClear, addonBefore, datePickerType, showTime, placement } = element;

  const { eventFunctions } = useRegisterEvents(element);

  const handleEvent = (action: EEventAction) => (e: any) => {
    eventFunctions[action]?.(e.target.value);
  };

  const handleChange = (date: Date) => {
    setFieldValue(date ? formatDate(date, dateFormat!) : undefined);
  };

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  const attributes = useMemo(() => {
    const baseAttributes = {
      placeholder,
      allowClear,
      customStyle,
      label: addonBefore,
      placement
    }

    if (datePickerType === '') {
        return assign(baseAttributes, {
          format: dateFormat,
          showTime: showTimeFormat(dateFormat!)
        })
    }

    return assign(baseAttributes, {
      picker: datePickerType,
    })
    
  }, [dateFormat, placeholder, allowClear, addonBefore, datePickerType, placement, customStyle])
  // console.log('attributes', attributes)
 
  return (
    <DatePicker
      // format={dateFormat}
      // @ts-ignore
      value={fieldValue ? moment(fieldValue, dateFormat) : undefined}
      // showTime={showTimeFormat(dateFormat!)}
      // showTime={showTime}
      getPopupContainer={(n: any) => n.parentElement}
      onChange={handleChange}
      onFocus={handleEvent(EEventAction.ON_FOCUS)}
      onBlur={handleEvent(EEventAction.ON_BLUR)}
      {...attributes}
      // placement="bottomRight"
      // placeholder={placeholder}
      // allowClear={allowClear}
      // style={customStyle}
      // label={addonBefore}
      // picker={datePickerType}
    />
  );
};
