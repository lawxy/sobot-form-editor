import React, { useEffect } from 'react';
import { Tabs } from '@sobot/soil-ui';

import store from '@/store';
import type { TElementRender } from '@/types';
import { idCreator } from '@/utils';
import { RenderElementWithLayout } from '@/components';
import { initialData, ELEMENT_CONTAINER } from '../container';
import { prefixCls } from '@/index';

export const createPanel = (props = {}) => {
  const panel = {
    ...initialData,
    elementName: 'tab选项卡',
    type: ELEMENT_CONTAINER,
    id: idCreator('tab-panel'),
    ...props,
  };
  store.appendEl(panel, false);
};

export const RenderTabs: TElementRender = ({ element, customStyle }) => {
  const { children, underline } = element;

  const items = children?.map((child) => {
    store.flatElement(child);
    return {
      label: child.elementName!,
      key: child.id!,
      children: <RenderElementWithLayout element={child} />,
    };
  });

  useEffect(() => {
    if (!children?.length) {
      createPanel({ parentId: element.id });
      store.setSelectedElement(element);
    }
  }, [children?.length]);

  return (
    <Tabs
      className={prefixCls('render-tabs')}
      items={items}
      type={element.tabType}
      style={customStyle}
      underline={underline}
    />
  );
};
