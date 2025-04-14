import React from 'react';
import { Input } from '@sobot/soil-ui';
import { SettingItem, SettingWrap } from '@/components';
import type { TElementSetting } from '@/types';

export const SettingUpload: TElementSetting = ({ element, setElementProp }) => {
  const { uploadUrl, addonAfter } = element;
  return (
    <SettingWrap title='元素设置'>
      <SettingItem label="tip">
        <Input
          value={addonAfter}
          onChange={(e) => {
            setElementProp('addonAfter', e.target.value);
          }}
        />
      </SettingItem>
      <SettingItem label="上传地址">
        <Input
          value={element.uploadUrl}
          onChange={(e) => {
            setElementProp('uploadUrl', e.target.value);
          }}
        />
      </SettingItem>
    </SettingWrap>
  );
};
