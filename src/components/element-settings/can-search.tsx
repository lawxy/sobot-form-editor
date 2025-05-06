import React from 'react';
import { observer } from 'mobx-react-lite';
import { Switch } from 'antd';
import { SettingItem } from '../setting-common';
import store from '@/store';

export const CanSearchSetting = observer(() => {
  const { canSearch } = store.selectedElement;

  return (
    <SettingItem label="支持搜索" tips='canSearch'>
      <Switch
        size="small"
        checked={canSearch}
        onChange={(val) => {
          store.setSelectedProp('canSearch', val);
        }}
      />
    </SettingItem>
  );
});
