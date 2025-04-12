import React from 'react';
import type { FC, ReactNode } from 'react';
import type { TabsProps } from '@sobot/soil-ui';
import { prefixCls } from '@/const';

import { observer } from 'mobx-react-lite';
import { tabStore, type TElementTab } from '@/store';
import BasicInfo from './element-settings/basic-info';
import {
  CustomCssSetting,
  FormCssSetting,
  ElementCssSetting,
} from './element-settings/custom-css-setting';

import { Tabs } from '@sobot/soil-ui';

export const TabsSetting: FC<{
  attributes?: ReactNode;
  events?: ReactNode;
  hideCss?: boolean;
}> = observer(({ attributes, events, hideCss }) => {
  const items: TabsProps['items'] = [
    {
      key: 'attribute',
      label: `属性`,
      children: (
        <div className={prefixCls('basic-info')}>
          <BasicInfo />
          {attributes}
        </div>
      ),
    },
    !hideCss && {
      key: 'style',
      label: `样式`,
      children: <ElementCssSetting />,
    },
    {
      key: 'event',
      label: '事件',
      children: <>{events}</>,
    },
  ].filter(Boolean) as TabsProps['items'];

  return (
    <Tabs
      activeKey={tabStore.elementTab}
      onChange={(key) => {
        tabStore.setElementTab(key as TElementTab);
      }}
      items={items}
    />
  );
});
