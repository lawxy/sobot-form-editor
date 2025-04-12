import React from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { PlacementOptions } from '../../const';
import store from '../../store';
import { SettingItem } from '../setting-common';

export const PlacementSetting = observer(() => {
  const { placement } = store.selectedElement;
  return (
    <SettingItem label="位置" tips="placement">
      <Select
        options={PlacementOptions}
        value={placement}
        onChange={(value) => store.setSelectedProp('placement', value)}
      />
    </SettingItem>
  );
});
