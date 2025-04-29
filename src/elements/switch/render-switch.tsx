import React, { useMemo } from 'react';
import { Switch } from '@sobot/soil-ui';
import { useGetEventFunctions, useFormUpdate, useValueImmediately } from '@/hooks';
import { isNil, isUndefined } from 'lodash-es';

import { EEventAction, type TElementRender } from '@/types';
import { getValueFromInput } from '@/utils';

const RenderSwitchContent: TElementRender = ({
  element,
  fieldValue,
  customStyle,
  setFieldValue,
  extendProps,
}) => {
  const { openValue, closeValue, addonAfter, disabled, defaultValue } = element;
  const { eventFunctions, immediateFunctions } = useGetEventFunctions(element);

  const realCheckedValue = useMemo(() => {
    return getValueFromInput(openValue);
  }, [openValue]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  const switchValue = useMemo(() => {
    if (isUndefined(fieldValue)) {
      return defaultValue;
    }
    return fieldValue;
  }, [fieldValue, defaultValue]);

  useValueImmediately(immediateFunctions, switchValue);
  
  return (
    <Switch
      disabled={disabled}
      checked={!isNil(switchValue) && switchValue === realCheckedValue}
      onChange={(checked) => {
        setFieldValue(
          checked ? realCheckedValue : getValueFromInput(closeValue),
        );
      }}
      style={customStyle}
      {...extendProps}
    >
      {addonAfter?.langText}
    </Switch>
  );
};

export const RenderSwitch = RenderSwitchContent;
