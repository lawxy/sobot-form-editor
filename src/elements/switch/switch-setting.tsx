import React, { useMemo } from 'react';
import { Input, Select, Switch } from 'antd';
import { isNil } from 'lodash-es';
import {
  SettingItem,
  SettingWrap,
  DefaultValueSetting,
  DisabledSetting,
} from '@/components';
import type { TElementSetting } from '@/types';
import { getValueFromInput } from '@/utils';

export const SettingSwitch: TElementSetting = ({
  element,
  setElementProp,
  setFieldValue,
}) => {
  const { openValue, closeValue, addonAfter } = element;

  const realCheckedValue = useMemo(() => {
    return getValueFromInput(openValue);
  }, [openValue]);

  return (
    <SettingWrap title="元素设置">
      <SettingItem label="后缀文案">
        <Input
          value={addonAfter}
          onChange={(e) => setElementProp('addonAfter', e.target.value)}
        />
      </SettingItem>
      <SettingItem
        tips="按照基本数据类型填写, 比如 true 或 1 或 '1'"
        label="开启值"
      >
        <Input
          value={element?.openValue}
          onChange={(e) => {
            setElementProp('openValue', e.target.value);
          }}
        />
      </SettingItem>
      <SettingItem label="关闭值">
        <Input
          value={element?.closeValue}
          onChange={(e) => {
            setElementProp('closeValue', e.target.value);
          }}
        />
      </SettingItem>
      <DefaultValueSetting>
        {(value) => (
          <Switch
            size="small"
            checked={!isNil(value) && value === realCheckedValue}
            onChange={(checked) => {
              setElementProp(
                'defaultValue',
                checked ? realCheckedValue : getValueFromInput(closeValue),
              );
              // setFieldValue(
              //   checked ? realCheckedValue : getValueFromInput(closeValue),
              // );
            }}
          />
        )}
      </DefaultValueSetting>
      <DisabledSetting />
    </SettingWrap>
  );
};
