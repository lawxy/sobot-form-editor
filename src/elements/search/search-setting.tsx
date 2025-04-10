import React from 'react';
import { Switch } from 'antd';

import {
  PlaceholderSetting,
  SettingItem,
  SettingWrap,
  DefaultValueSetting,
  AllowClear,
  DisabledSetting,
} from '@/components';
import type { TElementSetting } from '@/types';

export const SettingSearch: TElementSetting = ({ element, setElementProp }) => {
  const { disabled } = element;
  return (
    <>
      <SettingWrap title="元素设置">
        <DefaultValueSetting />
        <PlaceholderSetting />
        <DisabledSetting />
        <AllowClear />
      </SettingWrap>
    </>
  );
};
