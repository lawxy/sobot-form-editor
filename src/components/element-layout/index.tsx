import React, { useCallback, useMemo } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { Col, Form } from '@sobot/soil-ui';
import { Rule } from 'antd/es/form';
import { observer } from 'mobx-react-lite';
import { cloneDeep } from 'lodash-es';
import c from 'classnames';
import store from '@/store';
import { prefixCls } from '@/const';
import { useElementCommon } from '@/hooks';
import { useEditorContext } from '@/context';
import type { IBaseElement } from '../../types';
import { WrapEl } from './wrap-el';
import './style.less';

export const ElementLayout: FC<
  PropsWithChildren<{
    element: IBaseElement;
  }>
> = observer(({ element, children }) => {
  const {
    elementName,
    elementNameDisplay,
    id,
    fieldName,
    gridOffset,
    gridSpan,
    showElementName,
    gridLayout,
    regExps,
    parentId,
    type,
  } = element;
  const { elCss, contaninerCss } = useElementCommon(element);
  const { mode } = useEditorContext();
  // console.log('fieldName', fieldName);

  // 自定义css样式
  const style = useMemo(() => {
    const finnalStyle: React.CSSProperties = contaninerCss
      ? cloneDeep(contaninerCss)
      : {};

    if (!gridLayout) {
      Object.assign(finnalStyle, {
        flex: 'none',
        maxWidth: 'inherit',
      });
    }
    return finnalStyle;
  }, [contaninerCss, gridLayout]);

  // 校验规则
  const rules = useMemo<Rule[]>(() => {
    if (!regExps?.length) return [];
    const arr = [];
    const requiredRule = regExps[0];
    arr.push({
      required: requiredRule?.enable,
      message: requiredRule?.message?.langText,
    });
    regExps
      .slice(1)
      .filter((item) => item.enable && item.regexp && item.message?.langText)
      .forEach((patternItem) => {
        arr.push({
          validator(_: any, value: any = '') {
            const reg = new RegExp(patternItem.regexp as string);
            if (value?.match(reg)) {
              return Promise.resolve();
            }
            return Promise.reject(patternItem.message?.langText);
          },
        });
      });
    return arr;
  }, [regExps]);

  // 偏移量值 仅使用栅格布局才生效
  const offset = gridLayout ? gridOffset || 0 : 0;

  const content = (
    <WrapEl el={element} mode={mode}>
      <div
        className={c({
          [prefixCls('with-element-name')]: true,
          [prefixCls('with-element-name-horizontal')]:
            elementNameDisplay === 'horizontal',
        })}
      >
        {showElementName && (
          <div
            dangerouslySetInnerHTML={{
              // @ts-ignore
              __html: elementName?.langText,
            }}
            className={
              // @ts-ignore
              rules?.[0]?.required ? prefixCls('title-required') : ''
            }
          />
        )}
        <div
          className={prefixCls('element-content')}
          style={{
            display: element.isContainer ? 'block' : 'flex',
          }}
        >
          {React.isValidElement(children) &&
            React.cloneElement<any>(children, {
              ...(children?.props || {}),
              customStyle: elCss || {},
            })}
        </div>
      </div>
    </WrapEl>
  );

  return (
    <Col
      span={gridSpan}
      offset={offset}
      style={style}
      data-parent-id={parentId}
      data-id={id}
      data-type={type}
    >
      {element.isFormItem ? (
        <Form.Item name={fieldName || id} rules={rules}>
          {content}
        </Form.Item>
      ) : (
        content
      )}
    </Col>
  );
});

export const RenderElementWithLayout: FC<{
  element: IBaseElement;
}> = observer(({ element }) => {
  const { ElementsMap, LOCALE } = useEditorContext();

  const Component = useMemo(() => {
    const RenderComponent = ElementsMap[element.type!]?.render;
    if (!RenderComponent) return null;
    return RenderComponent;
  }, [element.type, ElementsMap]);

  const setFieldValue = useCallback(
    (value: any) => {
      if (element.fieldName) {
        store.setFieldValue(element.fieldName!, value);
      } else {
        store.setFieldValue(element.id!, value);
      }
    },
    [element.id, element.fieldName],
  );

  const setElementProp = useCallback(
    <T extends keyof IBaseElement>(field: T, value: IBaseElement[T]) => {
      store.setElementProp(element.id!, field, value);
    },
    [element.id],
  );

  if (!Component) return null;

  return (
    <ElementLayout element={element}>
      <Component
        fieldValue={
          element.fieldName
            ? store.fieldValues[element.fieldName!]
            : store.fieldValues[element.id!]
        }
        setFieldValue={setFieldValue}
        setElementProp={setElementProp}
        element={element}
        LOCALE={LOCALE}
      />
    </ElementLayout>
  );
});
