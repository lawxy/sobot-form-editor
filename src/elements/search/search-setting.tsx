import React from 'react';

import {
  PlaceholderSetting,
  SettingWrap,
  DefaultValueSetting,
  AllowClear,
  DisabledSetting,
} from '@/components';
import type { TElementSetting } from '@/types';

export const SettingSearch: TElementSetting = () => {
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
