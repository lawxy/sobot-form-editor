import React from 'react';
import { Input } from '@sobot/soil-ui';
import type { TElementRender } from '@/types';
import { RenderElementWithLayout } from '@/components';
import store from '@/store';
import { useDesignEffect } from '@/hooks';
import { getChildren } from './const';
import { prefixCls } from '@/index';
import './style.less';

export const RenderSelectInput: TElementRender = ({
  element,
  customStyle,
}) => {
  const { children, id } = element;

  useDesignEffect(() => {
    store.setSelectedProp('children', getChildren(id!));
  }, [])

  // useDesignEffect(() => {
  //   if (children?.length) return;
  //   store.setSelectedElement(element.children![0]);
  // }, [children])

  return (
    <Input.Group compact className={`${prefixCls}-input-group`} style={customStyle}>
      {
        children?.map((child) => {
          // store.flatElement(child);
          return <RenderElementWithLayout key={child.id} element={child} />
        })
      }
    </Input.Group>
  );
};
