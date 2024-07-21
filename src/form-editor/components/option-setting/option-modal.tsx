import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  Modal,
  Table,
  Space,
  Button,
  Input,
  message,
  Popover,
  type TableColumnProps,
} from 'antd';
import { arrayMoveImmutable } from 'array-move';
import { cloneDeep } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import type { FC, PropsWithChildren } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';

import { BatchGenerateOptions } from '../batch-generate-options';

import store from '@/store';
import type { TOption } from '@/types';
import { idCreator } from '@/utils';

const OptionModal: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [valueOptions, setOption] = useState<TOption[]>([]);
  const tableRef = useRef<any>();
  const valueOptionsRef = useRef<TOption[]>();
  valueOptionsRef.current = valueOptions;

  useEffect(() => {
    setOption(store.selectedElement?.valueOptions || []);
  }, [store.selectedElement.valueOptions]);

  const handleInputChange = (idx: number, field: keyof TOption, value: any) => {
    const newOptions = cloneDeep(valueOptions);
    newOptions[idx][field] = value;
    setOption(newOptions);
  };

  const judgeOptionsInvalid = () => {
    return valueOptions.some((item) => !item.label || !item.value);
  };

  const addOption = () => {
    if (judgeOptionsInvalid()) {
      message.error('属性或值不为空, 补充完成再新增或保存');
      return;
    }
    const newOptions = cloneDeep(valueOptions);
    newOptions.push({ label: '', value: '', id: idCreator('option') });
    setOption(newOptions);
  };

  useEffect(() => {
    if (!open || !tableRef.current) return;
    const rowEl = tableRef.current.querySelector('.ant-table-tbody');
    const sortIns = new Sortable(rowEl, {
      animation: 150,
      group: 'table',
      handle: '.draggble-btn',
      onSort: function (e: any) {
        const { newIndex, oldIndex } = e;
        // 为什么这里的索引都会比真实的大1 ？？
        const newValueOptions = arrayMoveImmutable(
          valueOptionsRef.current || [],
          oldIndex - 1,
          newIndex - 1,
        );
        setOption(newValueOptions);
      },
    });
    return () => {
      sortIns?.destroy?.();
    };
  }, [open, tableRef.current]);

  const columns: TableColumnProps<TOption>[] = [
    {
      key: 'sort',
      align: 'center',
      width: 40,
      render: () => {
        return (
          <Button
            className="draggble-btn"
            type="text"
            size="small"
            icon={<MenuOutlined />}
            style={{ cursor: 'move' }}
          />
        );
      },
    },
    {
      title: '选项名',
      dataIndex: 'label',
      render(val: string, _: any, idx: number) {
        return (
          <Input
            value={val}
            onChange={(e) => {
              handleInputChange(idx, 'label', e.target.value);
            }}
          />
        );
      },
    },
    {
      title: '值',
      dataIndex: 'value',
      render(val: string, _: any, idx: number) {
        return (
          <Input
            value={val}
            onChange={(e) => {
              handleInputChange(idx, 'value', e.target.value);
            }}
          />
        );
      },
    },
    {
      title: '操作',
      width: 60,
      render(_, __, idx: number) {
        return (
          <Space>
            <span
              onClick={() => {
                const newOptions = cloneDeep(valueOptions);
                newOptions.splice(idx, 1);
                setOption(newOptions);
                if (!newOptions.length) {
                  setOption([
                    { label: '', value: '', id: idCreator('option') },
                  ]);
                }
              }}
            >
              <MinusCircleOutlined
                style={{ color: '#D40000', cursor: 'pointer' }}
              />
            </span>
            {idx === valueOptions.length - 1 && (
              <span onClick={addOption}>
                <PlusCircleOutlined
                  style={{ color: '#287DFA', cursor: 'pointer' }}
                />
              </span>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement<any>(children, {
          onClick: () => setOpen(true),
        })}
      <Modal
        open={open}
        title={
          <BatchGenerateOptions
            title={
              <>
                属性设置&nbsp;
                <Popover content="格式: 属性名: 属性值, 多字段换行分隔">
                  <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
                </Popover>
              </>
            }
            options={valueOptions}
            setOptions={setOption}
            labelField="label"
            valueField="value"
          />
        }
        maskClosable={false}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          if (judgeOptionsInvalid()) {
            message.error('属性或值不为空, 补充完成再新增或保存');
            return;
          }
          store.setSelectedProp('valueOptions', valueOptions);
          setOpen(false);
        }}
      >
        <div ref={tableRef}>
          <Table<TOption>
            columns={columns}
            rowKey="id"
            dataSource={valueOptions}
            pagination={false}
            scroll={{ y: 300 }}
          />
        </div>
      </Modal>
    </>
  );
};

export default observer(OptionModal);
