import React, { useMemo, useLayoutEffect } from 'react';
import c from 'classnames';
import { useEditorContext } from '@/context';
import { prefixCls } from '@/const';
import { handleSort } from '@/utils';
import store from '@/store';
import { RenderElementWithLayout } from '@/components';
import type { IBaseElement, TElementRender } from '@/types';
import { ReactSortable } from '@sobot/form-editor-ui';
import './style.less';

export const RenderContainer: TElementRender = ({
  element,
  customStyle,
}) => {
  const { id } = store.editorAttrs;
  const { mode, ElementsMap, isDesign } = useEditorContext();
  const {
    parentId,
    horizontalGap = 0,
    verticalGap = 0,
    align,
    justify,
    direction,
  } = element;

  const style = useMemo(() => {
    return {
      width: '100%',
      ...customStyle,
    };
  }, [customStyle]);


  return (
    <ReactSortable<IBaseElement>
      list={element.children || []}
      animation={150}
      group="nested"
      onSort={(e) => handleSort(ElementsMap, e, element.id!)}
      rowProps={{
        className: c({
          [`${prefixCls('row')}`]: true,
          [`${prefixCls('row-el')}`]: true,
          [`${prefixCls('row-el-design')}`]: isDesign,
          [`${prefixCls('row-empty')}`]:
            isDesign && !element.children?.length,
        }),
        align,
        justify,
        gutter: [horizontalGap, verticalGap],
        'data-id': element.id,
        'data-parent-id': parentId || id,
        style: {
          flexDirection: direction === 'vertical' ? 'column' : 'row',
        },
      }}
      forbidden={!isDesign}
      style={style}
    >
      {element.children?.map((item: IBaseElement) => {
        // store.flatElement(item);
        return <RenderElementWithLayout element={item} key={item.id} />;
      })}
    </ReactSortable>
  );
};
