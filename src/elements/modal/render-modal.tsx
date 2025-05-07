import React, { useMemo } from 'react';
import { Modal } from '@sobot/soil-ui';
import c from 'classnames';
import { useDesignEffect, useGetEventFunctions } from '@/hooks';
import { TElementRender } from '@/types';
import store from '@/store';
import { RenderElementWithLayout } from '@/components/element-layout';
import { useEditorContext } from '@/context';
import { prefixCls } from '@/const';
import { parseText } from '@/utils';
import { createFooter, createContent } from './const';
import './style.less';

export const RenderModal: TElementRender = ({
  element,
  customStyle,
  extendProps,
}) => {
  const { isDesign } = useEditorContext();
  const { eventFunctions } = useGetEventFunctions(element);
  const { children, id, hidden, maskClosable, title, mask } = element;

  useDesignEffect(() => {
    if(!children?.length) {
      const children = [
        createContent(id!),
        createFooter(id!),
      ]
      store.setElementProp(id!, 'children', children);

    } else if(children?.length === 1) {
      const childId = children[0].id;
      if(childId?.includes('modal-content')) {
        store.setElementProp(id!, 'children', [children[0], createFooter(id!)]);
      } else {
        store.setElementProp(id!, 'children', [createContent(id!), children[0]]);
      }
    }
  }, [children?.length])

  return (
    <Modal
      className={c(prefixCls('modal-wrapper'), {
        [prefixCls('modal-wrapper-design')]: isDesign && store.selectedElement?.id === id,
      })}
      title={parseText(title)}
      visible={!hidden}
      onCancel={() => {
        if(isDesign) {
          store.setSelectedElement(element);
          return;
        }
        store.setElementProp(id!, 'hidden', true);
      }}
      getContainer={() => document.querySelector('.fe-canvas-wrap')!}
      maskClosable={isDesign ? true : maskClosable}
      forceRender={isDesign}
      footer={children?.[1] && <RenderElementWithLayout key='footer' element={children?.[1]} />}
      mask={mask}
      {...extendProps}
    >
      {
        children?.[0] && (
          <RenderElementWithLayout key='content' element={children?.[0]} />
        )
      }
    </Modal>
  );
};
