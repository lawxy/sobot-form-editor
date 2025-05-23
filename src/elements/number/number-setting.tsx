import React, { useCallback } from 'react';
import { InputNumber, Select } from '@sobot/soil-ui';
import {
  SettingItem,
  SettingWrap,
  RegPattern,
  DefaultValueSetting,
} from '@/components';
import type { IBaseElement, TElementSetting } from '@/types';
import { valueTypeOptions } from './const';

export const SettingNumber: TElementSetting = ({
  element,
  setElementProp,
  setFieldValue,
}) => {
  const handleChange = useCallback((field: keyof IBaseElement) => {
    return (val: any) => setElementProp(field, val);
  }, []);

  return (
    <>
      <SettingWrap title="元素设置">
        <DefaultValueSetting tips='defaultValue'>
          {(value) => (
            <InputNumber
              min={element?.minNum}
              max={element?.maxNum}
              value={value}
              onChange={(v) => {
                setElementProp('defaultValue', v);
                // setFieldValue(v);
              }}
            />
          )}
        </DefaultValueSetting>
        <SettingItem label="最小值" tips='minNum'>
          <InputNumber
            value={element?.minNum}
            onChange={handleChange('minNum')}
          />
        </SettingItem>
        <SettingItem label="最大值" tips='maxNum'>
          <InputNumber
            value={element?.maxNum}
            onChange={handleChange('maxNum')}
          />
        </SettingItem>
        <SettingItem label="数据类型" tips='valueType'>
          <Select
            value={element?.valueType}
            options={valueTypeOptions}
            onChange={handleChange('valueType')}
          />
        </SettingItem>
      </SettingWrap>
      <RegPattern />
    </>
  );
};
