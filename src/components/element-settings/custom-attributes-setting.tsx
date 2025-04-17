import React from 'react';
import * as antd from 'antd';
import { Button } from 'antd';
import store from '@/store';
import { SettingItem } from '../setting-common';
import { AttributesSetting } from './attributes-setting'

const defaultCustomAttributes = `function main() {
  return {

  }
}`


export const CustomAttributesSetting = () => {
  return (
    <SettingItem label="自定义属性">
      <AttributesSetting
        title="自定义属性设置"
        value={store.selectedElement.extendAttributes || defaultCustomAttributes}
        onChange={(value) => {
          store.setSelectedProp('extendAttributes', value);
        }}
        editorType="javascript"
      >
        <Button size="small">编辑</Button>
      </AttributesSetting>
    </SettingItem>
  );
};
