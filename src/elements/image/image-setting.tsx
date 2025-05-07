import React from 'react';
import { Input, Switch } from '@sobot/soil-ui';
import { SettingWrap, SettingItem, DefaultValueSetting, WithLanguage } from '@/components';
import type { TElementSetting, TextWithLang } from '@/types';

export const SettingImage: TElementSetting = ({ element, setElementProp }) => {
  const { placeholder, preview, previewSrc } = element;
  return (
    <>
      <SettingWrap title="元素设置">
        <DefaultValueSetting label="默认地址" tips='defaultValue' />
        <SettingItem label="占位地址" tips='placeholder'>
          <WithLanguage.Input
            value={placeholder}
            onChange={(v: TextWithLang) => {
              setElementProp('placeholder', v);
            }}
          />
        </SettingItem>
        <SettingItem label="支持预览" tips='preview'>
          <Switch
            checked={preview}
            size="small"
            onChange={(val) => setElementProp('preview', val)}
          />
        </SettingItem>
        {preview && (
          <SettingItem label="预览地址" tips='previewSrc'>
            <Input
              value={previewSrc}
              onChange={(e) => {
                setElementProp('previewSrc', e.target.value);
              }}
            />
          </SettingItem>
        )}
      </SettingWrap>
    </>
  );
};
