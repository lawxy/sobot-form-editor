import React from 'react';
import { Input, Switch } from '@sobot/soil-ui';
import { SettingWrap, SettingItem, DefaultValueSetting } from '@/components';
import type { TElementSetting } from '@/types';

export const SettingImage: TElementSetting = ({ element, setElementProp }) => {
  const { placeholder, preview, previewSrc } = element;
  return (
    <>
      <SettingWrap title="元素设置">
        <DefaultValueSetting label="默认地址" tips='defaultValue' />
        <SettingItem label="占位地址" tips='placeholder'>
          <Input
            value={placeholder}
            onChange={(e) => {
              setElementProp('placeholder', e.target.value);
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
