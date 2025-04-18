import React, { useEffect, useRef, useMemo } from 'react';
import { Table } from '@sobot/soil-ui';

import type { TElementRender } from '@sobot/form-editor';
import {
  useFormUpdate,
  useRegisterEvents,
  EEventAction,
} from '@sobot/form-editor';
import type { ITableEdit } from './type';

export const RenderTable: TElementRender = ({
  fieldValue = [],
  element,
  customStyle,
  setElementProp,
}) => {
  const {
    columns = [],
    linkLoading,
    scrollX,
    scrollY,
    pageSize,
    pagination,
    total,
    currentPage,
    extendProps
  } = element;

  const { eventFunctions } = useRegisterEvents(element);

  const editData = useRef<ITableEdit>({});

  useEffect(() => {
    Object.assign(editData.current, {
      page: currentPage!,
      pageSize: pageSize!,
    });
  }, [pageSize, currentPage]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.(editData.current);
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  useFormUpdate(() => {
    eventFunctions[EEventAction.PAGINATION_CHANGE]?.(
      `${currentPage},${pageSize}`,
    );
  }, [currentPage, pageSize]);

  const tableColumns = useMemo(() => {
    return columns.map((column) => {
      return {
        ...column,
        title: column.title.langText,
      };
    });
  }, [columns]);

  return (
    <Table
      columns={tableColumns}
      rowKey="id"
      dataSource={fieldValue}
      loading={linkLoading}
      style={customStyle}
      scroll={{ y: scrollY, x: scrollX }}
      pagination={
        pagination && {
          total: total ?? fieldValue?.length,
          pageSize,
          current: currentPage,
          showTotal: () => null,
          onChange(currentPage) {
            setElementProp('currentPage', currentPage);
          },
        }
      }
      {...extendProps}
    />
  );
};
