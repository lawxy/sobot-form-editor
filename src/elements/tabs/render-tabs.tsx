import React, { useEffect, useMemo } from 'react';
import { Tabs } from '@sobot/soil-ui';
import { isUndefined, rest } from 'lodash-es';

import store from '@/store';
import { prefixCls } from '@/const';
import { EEventAction } from '@/types';
import { useFormUpdate, useValueImmediately, useGetEventFunctions } from '@/hooks';
import type { TElementRender } from '@/types';
import { idCreator, formatTooltip, parseText } from '@/utils';
import { RenderElementWithLayout } from '@/components';
import { createContainer } from '../container';
import { ELEMENT_TAB_PANEL } from './const';
import { useEditorContext } from '@/context';

export const createPanel = (props = {}) => {
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
  fieldValue,
  setFieldValue
}) => {
  const { children, underline } = element;

  const { mode } = useEditorContext();

  const { eventFunctions, immediateFunctions } = useGetEventFunctions(element);

  useEffect(() => {
    if (!children?.length) {
      createPanel({ parentId: element.id });
      store.setSelectedElement(element);
    }
  }, [children?.length]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  const activeKey = useMemo(() => {
    if (isUndefined(fieldValue)) {
      return children?.[0]?.id;
    }
    return fieldValue;
  }, [fieldValue, children]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.VALUE_CHANGE]?.(activeKey);
  }, [activeKey]);

  useValueImmediately(immediateFunctions, activeKey);

  const items = children?.map((child) => {
    store.flatElement(child);
    const { tooltip, disabled } = child;
    const extendProps = store.getElementExtendAttrs(child.id!);
    const { tooltip: extendTooltip, ...extendRest } = extendProps;

    return {
      label: parseText(child.elementName),
      key: child.id!,
      children: <RenderElementWithLayout element={child} />,
      tooltip: formatTooltip(extendTooltip || tooltip) || null,
      disabled: mode === 'design' ? false : !!disabled,
      ...extendRest,
    };
  });

  return (
    <Tabs
      activeKey={activeKey}
      onChange={(key) => {
        setFieldValue(key);
      }}
      className={prefixCls('render-tabs')}
      items={items}
      type={element.tabType}
      style={customStyle}
      underline={underline}
      {...extendProps}
    />
  );
};
