import React from 'react';
import { Button, Typography, Input, Popconfirm, Tooltip } from '@sobot/soil-ui';
import { cloneDeep } from 'lodash-es';
import { MenuOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ReactSortable } from '@sobot/form-editor-ui';
import { arrayMoveImmutable } from 'array-move';
import { prefixCls } from '@/const';
import { SettingItem } from '@/components';
import { idCreator } from '@/utils';
import { EditModal } from './edit-modal';
import type { TColumn, TElementSetting } from '@/types';
import './style.less';

export const ColumnsSetting: TElementSetting = ({
  element,
  setElementProp,
}) => {
  const { columns = [] } = element;
  return (
    <SettingItem label="表格列配置" vertical>
      <ReactSortable
        list={columns}
        animation={150}
        onSort={({ newIndex, oldIndex }) => {
          const newColumns = cloneDeep(columns);
          setElementProp(
            'columns',
            arrayMoveImmutable(newColumns, oldIndex!, newIndex!),
          );
        }}
        handle={'.' + prefixCls('column-setting-drag-icon')}
      >
        {columns?.map((column: TColumn, idx: number) => (
          <div key={column.id} className={prefixCls('column-setting')}>
            <span className={prefixCls('column-setting-drag-icon')}>
              <MenuOutlined />
            </span>
            <Typography.Text
              // ellipsis={{
              //   tooltip: true,
              // }}
              style={{ width: 200 }}
            >
              <Input value={column.title} readOnly />
            </Typography.Text>
            <EditModal
              onChange={(values) => {
                const newColumns = cloneDeep(columns);
                newColumns[idx] = values;
                setElementProp('columns', newColumns);
              }}
              initialValues={column}
            >
              <Tooltip title="编辑">
                <EditOutlined />
              </Tooltip>
            </EditModal>
            <Popconfirm
              placement="topLeft"
              title="确认删除"
              onConfirm={() => {
                const newColumns = cloneDeep(columns);
                newColumns.splice(idx, 1);
                setElementProp('columns', newColumns);
              }}
            >
              <DeleteOutlined style={{ marginLeft: 8 }} />
            </Popconfirm>
          </div>
        ))}
      </ReactSortable>
      <EditModal
        onChange={(values) => {
          values.id = idCreator('col');
          setElementProp('columns', [...columns, values]);
        }}
      >
        <Button
          size="small"
          type="dashed"
          className={prefixCls('add-button')}
          style={{ fontSize: 12 }}
        >
          + 新增一列
        </Button>
      </EditModal>
    </SettingItem>
  );
};
