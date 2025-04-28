import React from 'react';
import { Input, Switch } from 'antd';
import {
  SettingItem,
  SettingWrap,
  WithLanguage,
} from '@/components';
import type { TElementSetting, TextWithLang } from '@/types';


export const SettingText: TElementSetting = ({ element, setElementProp, setFieldValue }) => {
  const { toggle, text, openValue, closeValue, defaultValue } = element;
  return (
    <SettingWrap title="元素设置">
      <SettingItem label="文案">
        <WithLanguage.Input
          value={text}
          onChange={(value: TextWithLang) => setElementProp('text', value)}
        />
      </SettingItem>

      <SettingItem label="是否可切换">
        <Switch size='small' checked={toggle} onChange={(checked) => setElementProp('toggle', checked)}/>
      </SettingItem>

      {
        toggle && (
          <>
            <SettingItem
              tips="按照基本数据类型填写, 比如 true 或 1 或 '1'"
              label="开启值"
            >
              <Input
                value={openValue}
                onChange={(e) => {
                  setElementProp('openValue', e.target.value);
                }}
              />
            </SettingItem>
            <SettingItem label="关闭值">
              <Input
                value={closeValue}
                onChange={(e) => {
                  setElementProp('closeValue', e.target.value);
                }}
              />
            </SettingItem>
            <SettingItem label="默认值">
              <Input
                value={defaultValue}
                onChange={(e) => {
                  setElementProp('defaultValue', e.target.value);
                }}
              />
            </SettingItem>
          </>
        )
      }

    </SettingWrap>
  )
};
