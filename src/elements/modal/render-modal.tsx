import React, { useState } from 'react';
import { Modal } from '@sobot/soil-ui';
import { useDesignEffect, useGetEventFunctions } from '@/hooks';

import { EEventAction, TElementRender } from '@/types';
import { parseText } from '@/utils';

import './style.less';
import { prefixCls } from '@/const';
import { getChildren } from './const';
import store from '@/store';
import { RenderElementWithLayout } from '@/components/element-layout';

export const RenderModal: TElementRender = ({
  element,
  customStyle,
  extendProps,
}) => {
  const { eventFunctions } = useGetEventFunctions(element);
  const { children, id } = element;
  const [open, setOpen] = useState(true);

  useDesignEffect(() => {
    console.log('in')
    if(!children?.length) {
      store.setElementProp(id!, 'children', getChildren(id!));
    }
  }, [children?.length])

  return (
    <Modal
      title='modal'
      visible={open}
      onCancel={() => setOpen(false)}
      getContainer={() => document.querySelector('.fe-canvas-wrap')!}
      maskClosable={false}
      {...extendProps}
    >
       {
        children?.map((child) => {
          store.flatElement(child);
          return <RenderElementWithLayout key={child.id} element={child} />
        })
      }
    </Modal>
  );
};
