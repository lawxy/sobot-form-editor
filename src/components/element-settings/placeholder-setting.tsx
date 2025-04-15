import React from 'react';
import { observer } from 'mobx-react-lite';
import { Input } from 'antd';
import { WithLanguage } from '../with-language';
import { SettingItem } from '../setting-common';
import store from '../../store';
import type { IBaseElement, TextWithLang } from '@/types';

export const PlaceholderSetting = observer(
  ({
    label = '暗文本提示',
    field = 'placeholder',
  }: {
    label?: string;
    field?: keyof IBaseElement;
  }) => {
    return (
      <SettingItem label={label}>
        <WithLanguage.Input
          value={store.selectedElement[field]}
          onChange={(val: TextWithLang) => {
            store.setSelectedProp(field, val);
          }}
        />
      </SettingItem>
    );
  },
);
