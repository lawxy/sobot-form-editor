import React from 'react';
import { Input } from '@sobot/soil-ui';
import { useRegisterEvents, useFormUpdate } from '@/hooks';
import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';

const { SelectInput } = Input;

const list = [
  { key: 111, name: '大于', id: 11111 },
  { key: 222, name: '小于', id: 22211 },
  { key: 333, name: '等于', id: 33311 },
  { key: 444, name: '很长很长很长的下拉列表省略了', id: 44411 },
];

export const RenderSelectInput: TElementRender = ({
  fieldValue,
  element = {},
  customStyle,
  setFieldValue,
}) => {
  const { id, placeholder, allowClear, disabled } =
    element;

  const { eventFunctions } = useRegisterEvents(element);

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

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(fieldValue);
  }, [fieldValue]);

  return (
    <SelectInput
    selectProps={{
      placeholder: '请选择',
      onChange: (value, Option) => {
        console.log(Option);
        console.log(value);
      },
      defaultValue: 44411,
      valueKey: 'id',
      labelKey: 'name',
      dataSource: list,
    }}
    inputProps={
      {
        placeholder: '请输入，回车搜索',
      }
    }
  />
     
  );
};
