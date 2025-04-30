import React, { useEffect } from 'react';
import { Tabs } from '@sobot/soil-ui';

import store from '@/store';
import type { TElementRender } from '@/types';
import { idCreator } from '@/utils';
import { RenderElementWithLayout } from '@/components';
import { createContainer } from '../container';
import { prefixCls } from '@/index';
import { ELEMENT_TAB_PANEL } from './const';

export const createPanel = (props = {}) => {
  // const panel = {
  //   ...initialData,
  //   elementName: { langText: 'tab选项卡', langKey: '' },
  //   type: ELEMENT_CONTAINER,
  //   id: idCreator('tab-panel'),
  //   ...props,
  // };

  const panel = createContainer({
    elementName: { langText: 'tab选项卡', langKey: '' },
    id: idCreator(ELEMENT_TAB_PANEL),
    ...props,
  })

  store.appendEl(panel, false);
};

export const RenderTabs: TElementRender = ({
  element,
  customStyle,
  extendProps,
}) => {
  const { children, underline } = element;

  const items = children?.map((child) => {
    store.flatElement(child);
    return {
      label: child.elementName?.langText,
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
      {...extendProps}
    />
  );
};
