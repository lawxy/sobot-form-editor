import React, { useState, useEffect, useRef } from 'react';
import type { FC, PropsWithChildren } from 'react';
import {
  Modal,
  Space,
  Input,
  message,
  Button,
  type TableColumnProps,
} from '@sobot/soil-ui';
import { TableSortable } from '@sobot/form-editor-ui';
import { observer } from 'mobx-react-lite';

import { cloneDeep } from 'lodash-es';

import {
  MinusIcon,
  PlusIcon,
  AttributesSetting,
  SettingItem,
  WithLanguage,
} from '@/components';
import type { TCustomPreset, TextWithLang } from '@/types';
import { idCreator } from '@/utils';
import store from '@/store';

const defaultPreset = {
  label: {
    langText: '今天',
    langKey: '',
  },
  id: idCreator('custom-range'),
  startDate: `function main(moment) {
    return moment();
};
`,
  endDate: `function main(moment) {
    return moment();
};
`,
};

export const OperationModal: FC<
  PropsWithChildren<{
    options: TCustomPreset[];
    onChange: (v: TCustomPreset[]) => void;
  }>
> = ({ children, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const [valueOptions, setOption] = useState<TCustomPreset[]>([]);
  const valueOptionsRef = useRef<TCustomPreset[]>();
  valueOptionsRef.current = valueOptions;

  useEffect(() => {
    setOption(options);
  }, [options]);

  const handleChange = (
    idx: number,
    field: keyof TCustomPreset,
    value: any,
  ) => {
    const newOptions = cloneDeep(valueOptions);
    newOptions[idx][field] = value;
    setOption(newOptions);
  };

  const judgeOptionsInvalid = () => {
    return valueOptions.some(
      (item) => !item.label?.langText || !item.startDate || !item.endDate,
    );
  };

  const addOption = () => {
    if (judgeOptionsInvalid()) {
      message.error('标题不为空');
      return;
    }
    const newOptions = cloneDeep(valueOptions);
    newOptions.push({ ...defaultPreset, id: idCreator('option') });
    setOption(newOptions);
  };

  const columns: TableColumnProps<TCustomPreset>[] = [
    {
      title: '标题',
      dataIndex: 'label',
      width: 150,
      render(val: string, _: any, idx: number) {
        return (
          <WithLanguage.Input
            value={val}
            onChange={(val: TextWithLang) => {
              handleChange(idx, 'label', val);
            }}
          />
        );
      },
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      render(val: string, _: any, idx: number) {
        return (
          <AttributesSetting
            title="开始日期"
            value={val}
            onChange={(v) => {
              handleChange(idx, 'startDate', v);
            }}
            editorType="javascript"
          >
            <Button size="small">编辑</Button>
          </AttributesSetting>
        );
      },
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      render(val: string, _: any, idx: number) {
        return (
          <AttributesSetting
            title="结束日期"
            value={val}
            onChange={(v) => {
              handleChange(idx, 'endDate', v);
            }}
            editorType="javascript"
          >
            <Button size="small">编辑</Button>
          </AttributesSetting>
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
                    { ...defaultPreset, id: idCreator('custom-range') },
                  ]);
                }
              }}
            >
              <MinusIcon />
            </span>
            {idx === valueOptions.length - 1 && (
              <span onClick={addOption}>
                <PlusIcon />
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
        visible={open}
        title="自定义日期范围"
        maskClosable={false}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          if (judgeOptionsInvalid()) {
            message.error('标题不为空');
            return;
          }
          onChange(valueOptions);
          setOpen(false);
        }}
      >
        <TableSortable
          onSort={(newDatas: any) => setOption(newDatas)}
          columns={columns}
          rowKey="id"
          dataSource={valueOptions}
          pagination={false}
          scroll={{ y: 300 }}
        />
      </Modal>
    </>
  );
};

export const CustomRangeSetting: FC = observer(() => {
  const customPresets = store.selectedElement.customPresets || [];

  return (
    <>
      <SettingItem label="">
        <OperationModal
          options={customPresets?.length ? customPresets : [defaultPreset]}
          onChange={(presets) => {
            store.setSelectedProp('customPresets', presets);
          }}
        >
          <Button size="small">编辑</Button>
        </OperationModal>
      </SettingItem>
    </>
  );
});
