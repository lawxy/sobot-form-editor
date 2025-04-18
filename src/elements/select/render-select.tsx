import React, { useMemo, useCallback } from 'react';
import { Select } from '@sobot/soil-ui';
import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';
import { parseCSS } from '@/utils';
import { isUndefined } from 'lodash-es';

export const RenderSelect: TElementRender = ({
  element,
  fieldValue,
  customStyle,
  setFieldValue,
}) => {
  const {
    multiple,
    valueOptions,
    placeholder,
    linkLoading,
    allowClear,
    disabled,
    addonBefore,
    canSearch,
    labelWrapperStyle,
    tagRenderText,
    defaultValue,
    extendProps
  } = element;

  const { eventFunctions } = useRegisterEvents(element);

  const dataSoruce = useMemo(() => {
    return valueOptions?.map((item) => ({
      key: item.value,
      value: item?.label?.langText,
    }));
  }, [valueOptions]);

  const onChange = useCallback(
    (val: any) => {
      // undefined 会触发显示默认值
      setFieldValue(val ? val : null);
    },
    [setFieldValue],
  );

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  const _labelWrapperStyle = useMemo(() => {
    return parseCSS(labelWrapperStyle)?.labelWrapperStyle || {};
  }, [labelWrapperStyle]);

  const selectValue = useMemo(() => {
    if (isUndefined(fieldValue)) {
      return defaultValue;
    }
    return fieldValue;
  }, [fieldValue, defaultValue]);
  return (
    <Select
      placeholder={placeholder?.langText}
      dataSoruce={dataSoruce}
      onChange={onChange}
      loading={linkLoading}
      style={customStyle}
      mode={multiple ? 'multiple' : undefined}
      allowClear={allowClear}
      value={selectValue}
      disabled={disabled}
      label={addonBefore?.langText}
      search={canSearch}
      labelWrapperStyle={_labelWrapperStyle}
      tagRenderText={tagRenderText}
      {...extendProps}
    />
  );
};
