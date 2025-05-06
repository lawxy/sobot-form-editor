import React from 'react';
import { observer } from 'mobx-react-lite';
import { Switch } from 'antd';
import { SettingItem } from '../setting-common';
import store from '@/store';

export const UseGroupSetting = observer(() => {
  const { useGroup } = store.selectedElement;

  return (
    <SettingItem label="使用分组" tips="useGroup, 使用分组才能托管在表单上">
      <Switch
        size="small"
        checked={useGroup}
        onChange={(val) => {
          store.setSelectedProp('useGroup', val);
        }}
      />
    </SettingItem>
  );
});
