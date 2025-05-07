import { Tabs } from '@sobot/soil-ui';
import type { TabsProps } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import ElementSetting from './element-setting';
import EditorSetting from './editor-setting';

import { FormService } from '@/components';
import { prefixCls } from '@/const';
import { tabStore } from '@/store';
import './style.less';

const items: TabsProps['items'] = [
  {
    key: 'element',
    label: `组件属性`,
    closable: false,
    children: <ElementSetting />,
  },
  {
    key: 'form',
    label: `编辑器属性`,
    closable: false,
    children: <EditorSetting />,
  },
  {
    key: 'service',
    label: `接口服务`,
    closable: false,
    children: <FormService />,
  },
];

const SettingsContent = () => {
  return (
    <div className={prefixCls('setting')}>
      <Tabs
        activeKey={tabStore.formTab}
        // @ts-ignore
        type="editable-card"
        hideAdd
        items={items}
        className={`${prefixCls('editor-setting-tab')}`}
        onChange={(tab: any) => {
          tabStore.setFormTab(tab);
        }}
      />
    </div>
  );
};
export const Settings = observer(SettingsContent);
