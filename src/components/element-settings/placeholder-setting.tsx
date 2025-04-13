import React from 'react';
import { observer } from 'mobx-react-lite';
import { Input } from 'antd';
import { SettingItem } from '../setting-common';
import store from '../../store';
import type { IBaseElement } from '@/types';

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
        <Input
          value={store.selectedElement[field] as string}
          onChange={(e) => {
            store.setSelectedProp(field, e.target.value);
          }}
        />
      </SettingItem>
    );
  },
);
