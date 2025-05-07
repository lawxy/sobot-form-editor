import React from 'react';
import { Switch } from 'antd';
import { SettingItem, SettingWrap, WithLanguage } from '@/components';
import type { TElementSetting, TextWithLang } from '@/types';

export const SettingModal: TElementSetting = ({ element, setElementProp }) => {
  const { mask, maskClosable, title } = element;
  return (
    <SettingWrap title="弹窗设置">
      <SettingItem label="标题" tips='title'>
        <WithLanguage.Input
          value={title}
          onChange={(val: TextWithLang) => {
            setElementProp('title', val);
          }}
        />
      </SettingItem>
      <SettingItem label="展示遮罩" tips='mask'>
        <Switch
          size='small'
          checked={mask}
          onChange={(val) => {
            setElementProp('mask', val);
          }}
        />
      </SettingItem>
      {
        mask && (
          <SettingItem label="点击蒙层是否允许关闭" tips='maskClosable'>
            <Switch
              size='small'
              checked={maskClosable}
              onChange={(val) => {
                setElementProp('maskClosable', val);
              }}
            />
          </SettingItem>
        )
      }
    </SettingWrap>
  );
};
