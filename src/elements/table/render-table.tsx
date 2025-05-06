import React, { useEffect, useRef, useMemo } from 'react';
import { Table } from '@sobot/soil-ui';

import type { TElementRender } from '@sobot/form-editor';
import {
  useFormUpdate,
  useGetEventFunctions,
  EEventAction,
} from '@sobot/form-editor';
import { parseText } from '@/utils'
import type { ITableEdit } from './type';

export const RenderTable: TElementRender = ({
  fieldValue = [],
  element,
  customStyle,
  setElementProp,
  extendProps,
}) => {
  const {
    columns = [],
    linkLoading,
    scrollX,
    scrollY,
    pageSize,
    pagination,
    total,
    current,
    rowKey
  } = element;

  const { eventFunctions } = useGetEventFunctions(element);

  const editData = useRef<ITableEdit>({});

  useEffect(() => {
    Object.assign(editData.current, {
      page: current!,
      pageSize: pageSize!,
    });
  }, [pageSize, current]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.(editData.current);
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.PAGINATION_CHANGE]?.(`${current},${pageSize}`);
  }, [current, pageSize]);

  const tableColumns = useMemo(() => {
    const iterateColumns = extendProps?.columns || columns;

    return iterateColumns.map((column) => {
      const { title, width, render } = column

      return {
        ...column,
        title: parseText(title),
        width: parseText(width),
        render: render ? render : (val) => {
          if(column.valueType === 'text') return val;
          const item = column?.options?.find((item) => item.value == val);
          return parseText(item?.label);
        }
      };
    });
  }, [columns, extendProps?.columns]);

  return (
    <Table
      rowKey={rowKey}
      dataSource={fieldValue}
      loading={linkLoading}
      style={customStyle}
      scroll={{ y: scrollY, x: scrollX }}
      pagination={
        pagination && {
          total: total ?? fieldValue?.length,
          pageSize,
          current,
          showTotal: () => null,
          onChange(currentPage) {
            setElementProp('current', currentPage);
          },
        }
      }
      {...extendProps}
      columns={tableColumns}
    />
  );
};
