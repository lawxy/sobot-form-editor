import React, { useCallback, useMemo } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { Col, Form, FormItemProps } from '@sobot/soil-ui';
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
    // showElementName,
    gridLayout,
    regExps,
    parentId,
    type,
    isFormItem,
    colon,
    fieldTooltip,
    showElementName,
    // extendFormItem
  } = element;
  const { elCss, contaninerCss } = useElementCommon(element);
  const { mode } = useEditorContext();

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
    <div
      className={c({
        [prefixCls('with-element-name')]: true,
        [prefixCls('with-element-name-horizontal')]:
          elementNameDisplay === 'horizontal',
      })}
    >
      {/* {showElementName && (
          <div
            dangerouslySetInnerHTML={{
              // @ts-ignore
              __html: elementName?.langText,
            }}
            className={c({
              // @ts-ignore
              [prefixCls('title-required')]: rules?.[0]?.required,
              [prefixCls('title-colon')]: !!colon,
            })}
          />
        )} */}
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
  );

  const formItemProps = store.getFormItemExtendAttrs(id!);

  return (
    <Col
      span={gridSpan}
      offset={offset}
      style={style}
      data-parent-id={parentId}
      data-id={id}
      data-type={type}
      data-field-name={fieldName}
    >
      <WrapEl el={element} mode={mode}>
        {isFormItem ? (
          <Form.Item
            name={fieldName || id}
            rules={rules}
            label={showElementName ? elementName?.langText : null}
            tooltip={fieldTooltip?.langText || null}
            colon={!!colon}
            {...formItemProps}
          >
            {content}
          </Form.Item>
        ) : (
          content
        )}
      </WrapEl>
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

  const extendProps = store.getElementExtendAttrs(element.id!) || {};

  if (!Component) return null;

  return (
    <ElementLayout element={element}>
      <Component
        fieldValue={
          element.fieldName
            ? store.fieldsValue[element.fieldName!]
            : store.fieldsValue[element.id!]
        }
        setFieldValue={setFieldValue}
        setElementProp={setElementProp}
        element={element}
        LOCALE={LOCALE}
        extendProps={extendProps}
      />
    </ElementLayout>
  );
});
