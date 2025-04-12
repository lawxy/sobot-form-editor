import React from 'react';
import { observer } from 'mobx-react-lite';
import { Switch } from 'antd';
import { SettingItem } from '../setting-common';
import store from '@/store';

export const DisabledSetting = observer(() => {
  const { disabled } = store.selectedElement;

  return (
    <SettingItem label="是否禁用">
      <Switch
        size="small"
        checked={disabled}
        onChange={(val) => {
          store.setSelectedProp('disabled', val);
        }}
      />
    </SettingItem>
  );
});
