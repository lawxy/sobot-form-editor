import React from 'react';
import { Input, Select } from '@sobot/soil-ui';
import { SettingItem, SettingWrap, WithLanguage } from '@/components';
import type { TElementSetting, TextWithLang } from '@/types';

export const SettingButton: TElementSetting = ({ element, setElementProp }) => {
  return (
    <SettingWrap title="按钮设置">
      <SettingItem label="按钮文案" tips='text'>
        <WithLanguage.Input
          value={element.text!}
          onChange={(val: TextWithLang) => {
            setElementProp('text', val);
          }}
        />
      </SettingItem>
      <SettingItem label="按钮类型" tips='btnType'>
        <Select
          value={element.btnType}
          options={[
            {
              label: '主要按钮',
              value: 'primary',
            },
            {
              label: '次要按钮',
              value: '',
            },
            {
              label: '文字按钮',
              value: 'text',
            },
            {
              label: '链接按钮',
              value: 'link',
            },
          ]}
          onChange={(v) => {
            setElementProp(
              'btnType',
              v as 'primary' | '' | 'dashed' | 'link' | 'text',
            );
          }}
        />
      </SettingItem>
      <SettingItem label="按钮大小" tips='size'>
        <Select
          value={element.size}
          options={[
            {
              label: '大按钮',
              value: 'large',
            },
            {
              label: '默认按钮',
              value: '',
            },
            {
              label: '小按钮',
              value: 'small',
            },
            {
              label: 'mini按钮',
              value: 'mini',
            },
          ]}
          onChange={(v) => {
            setElementProp('size', v as 'large' | '' | 'small' | 'mini');
          }}
        />
      </SettingItem>
    </SettingWrap>
  );
};
