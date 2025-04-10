import React, { useEffect, useRef } from 'react';
import { Table } from '@sobot/soil-ui';

import type { TElementRender } from '@sobot/form-editor';
import { useFormUpdate, useRegisterEvents, EEventAction } from '@sobot/form-editor';
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

  return (
    <Table
      columns={columns}
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
    />
  );
};
