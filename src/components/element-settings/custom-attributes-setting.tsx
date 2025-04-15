import React from 'react';
import { Button } from 'antd';
import store from '@/store';
import { SettingItem } from '../setting-common';
import { AttributesSetting } from './attributes-setting'

export const CustomAttributesSetting = () => {
  return (
    <SettingItem label="自定义属性">
      <AttributesSetting
        title="自定义属性设置"
        value={store.selectedElement.customAttributes}
        onChange={(value) => {
          console.log('value', value);
          store.setSelectedProp('customAttributes', value);
        }}
        editorType="javascript"
      >
        <Button size="small">编辑</Button>
      </AttributesSetting>
    </SettingItem>
  );
};
