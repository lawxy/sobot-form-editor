import React from 'react';
import { Input } from '@sobot/soil-ui';
import { SettingItem, SettingWrap, WithLanguage } from '@/components';
import type { TElementSetting, TextWithLang } from '@/types';

export const SettingUpload: TElementSetting = ({ element, setElementProp }) => {
  const { uploadUrl, addonAfter } = element;
  return (
    <SettingWrap title='元素设置'>
      <SettingItem label="tip">
        <WithLanguage.Input
          value={addonAfter!}
          onChange={(val: TextWithLang) => {
            setElementProp('addonAfter', val);
          }}
        />
      </SettingItem>
      <SettingItem label="上传地址">
        <Input
          value={uploadUrl}
          onChange={(e) => {
            setElementProp('uploadUrl', e.target.value);
          }}
        />
      </SettingItem>
    </SettingWrap>
  );
};
