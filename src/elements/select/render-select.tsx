import React, { useMemo, useCallback } from 'react';
import { Select } from '@sobot/soil-ui';
import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';
import { parseCSS } from '@/utils';
export const RenderSelect: TElementRender = ({
  element,
  fieldValue,
  customStyle,
  setFieldValue,
}) => {
  const { multiple, valueOptions, placeholder, linkLoading, allowClear, disabled, addonBefore, canSearch, labelWrapperStyle, tagRenderText } =
    element;

  const { eventFunctions } = useRegisterEvents(element);

  const dataSoruce = useMemo(() => {
    return valueOptions?.map((item) => ({
      key: item.value,
      value: item.label,
    }));
  }, [valueOptions]);

  const onChange = useCallback((val: any) => {
    setFieldValue(val);
  }, [setFieldValue]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  const _labelWrapperStyle = useMemo(() => {
    return parseCSS(labelWrapperStyle)?.labelWrapperStyle || {};
  }, [labelWrapperStyle]);

  return (
    <Select
      placeholder={placeholder}
      dataSoruce={dataSoruce}
      onChange={onChange}
      loading={linkLoading}
      style={customStyle}
      mode={multiple ? 'multiple' : undefined}
      allowClear={allowClear}
      value={fieldValue}
      disabled={disabled}
      label={addonBefore}
      search={canSearch}
      labelWrapperStyle={_labelWrapperStyle}
      tagRenderText={tagRenderText}
    />
  );
};
