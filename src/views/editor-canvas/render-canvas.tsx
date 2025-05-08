import React, { useMemo } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import { ReactSortable } from '@sobot/form-editor-ui';
import c from 'classnames';
import { useGetEventFunctions, useFormUpdate, useDesignEffect } from '@/hooks';
import { EEventAction } from '@/types';
import { prefixCls } from '@/const';
import eventStore from '@/store/eventStore';
import store from '@/store';
import type { IBaseElement, TMode } from '@/types';
import { handleOnEvent, parseCSS, handleSort } from '@/utils';
import { RenderElementWithLayout } from '@/components';

import './style.less';
import { useEditorContext } from '@/context';

const EditorCanvas: FC<PropsWithChildren<{}>> = () => {
  const { horizontalGap, verticalGap, id, events, customCss, align, justify } =
    store.editorAttrs;
  const { eventFunctions } = useGetEventFunctions({ id, events });
  const { ElementsMap, isDesign } = useEditorContext();

  const formStyle = useMemo(() => {
    if (!customCss) return {};
    const cssObj = parseCSS(customCss);
    return Object.values(cssObj)[0];
  }, [customCss]);

  // useDesignEffect(() => {
  //   const keydonwFn = (e: KeyboardEvent) => {
  //     if (e.key === 'Backspace' && document.activeElement === document.body) {
  //       store.deleteEl(store.selectedElement);
  //     }
  //   };
  //   document.addEventListener('keydown', keydonwFn);
  //   return () => {
  //     document.removeEventListener('keydown', keydonwFn);
  //   };
  // });

  // 表单加载事件
  useFormUpdate(() => {
    eventFunctions[EEventAction.FORM_LOADED]?.();
  }, [eventFunctions[EEventAction.FORM_LOADED]]);

  // 服务监听事件 - ps:不用关心设计模式下的运行
  useFormUpdate(() => {
    if (!store.formServices.length) return;
    store.formServices.forEach((serv) => {
      eventStore.emitter.on(serv.id!, handleOnEvent);
    });
    return () => {
      store.formServices.forEach((serv) => {
        eventStore.emitter.off(serv.id!);
      });
    };
  }, [store.formServices]);

  return (
    <div className={c({
      [prefixCls('canvas-wrap')]: true,
      [prefixCls('canvas-wrap-design')]: isDesign,
    })}>
      <ReactSortable<IBaseElement>
        className={prefixCls('canvas')}
        style={formStyle}
        list={store.formElements}
        onSort={(e) => handleSort(ElementsMap, e, id!)}
        animation={150}
        group="nested"
        rowProps={{
          className: prefixCls('row'),
          gutter: [horizontalGap, verticalGap],
          'data-id': id,
          align,
          justify,
        }}
        forbidden={!isDesign}
      >
        {store.formElements.map((item: IBaseElement) => {
          store.flatElement(item);
          return <RenderElementWithLayout key={item.id} element={item} />;
        })}
      </ReactSortable>
    </div>
  );
};

export default observer(EditorCanvas);
