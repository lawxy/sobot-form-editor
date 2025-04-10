import React from 'react';
import { Input, InputNumber, Select, Switch } from 'antd';

import {
  PlaceholderSetting,
  OptionSetting,
  SettingItem,
  SettingWrap,
  DefaultValueSetting,
  AllowClear,
} from '@/components';
import type { TElementSetting } from '@/types';

export const SettingSelectInput: TElementSetting = ({ element, setElementProp }) => {
  const {  disabled, valueOptions } = element;
  return (
    <>
      <SettingWrap title="元素设置">
        <DefaultValueSetting />
        <PlaceholderSetting />
   
        <AllowClear />
      </SettingWrap>
    </>
  );
};
