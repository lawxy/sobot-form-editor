import React from 'react';
import { Switch } from 'antd';

import {
  PlaceholderSetting,
  SettingItem,
  SettingWrap,
  DefaultValueSetting,
  AllowClear,
} from '@/components';
import type { TElementSetting } from '@/types';

export const SettingSearch: TElementSetting = ({ element, setElementProp }) => {
  const { disabled } = element;
  return (
    <>
      <SettingWrap title="元素设置">
        <DefaultValueSetting />
        <PlaceholderSetting />
   
        <SettingItem label="是否禁用">
          <Switch
            size="small"
            checked={disabled}
            onChange={(val) => {
              setElementProp('disabled', val);
            }}
          />
        </SettingItem>
        <AllowClear />
      </SettingWrap>
    </>
  );
};
