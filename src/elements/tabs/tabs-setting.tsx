import React from 'react';
import { observer } from 'mobx-react-lite';
import { Input, Space, Popconfirm, Select, Switch } from 'antd';
import { cloneDeep } from 'lodash-es';
import { MinusCircleOutlined } from '@ant-design/icons';
import { SettingWrap, PlusIcon, SettingItem, WithLanguage } from '@/components';
import { TableSortable } from '@sobot/form-editor-ui';
import store from '@/store';
import { createPanel } from './render-tabs';
import type { TElementSetting, TextWithLang } from '@/types';
import { prefixCls } from '@/const';
import './style.less';

const ObserverInput: React.FC<{ idx: number }> = observer(({ idx }) => {
  const current = store.selectedElement.children![idx];
  return (
    <WithLanguage.Input
      value={current.elementName!}
      onChange={(val: TextWithLang) => {
        store.setElementProp(current.id!, 'elementName', val);
      }}
   />
  );
});

export const SettingTabs: TElementSetting = ({ element, setElementProp }) => {
  const { children, id, tabType, underline, fieldName } = element;
  const { length } = children!;

  const defaultSelectedId = store.getFieldValue(fieldName! || id!);

  const handleAddPanel = () => {
    createPanel({
      elementName: {langText: `tab选项卡${length + 1}`, langKey: ''},
      parentId: id,
    });
  };

  const columns = [
    {
      title: '选项卡',
      dataIndex: 'elementName',
      render(val: string, _: any, idx: number) {
        return <ObserverInput idx={idx} />;
      },
    },
    {
      title: '默认项',
      dataIndex: 'defaultSelected',
      width: 80,
      render(val: boolean, _: any, idx: number) {
        return defaultSelectedId === children![idx].id ? '是' : '否';
      },
    },
    {
      title: '操作',
      width: 60,
      render(_: any, __: any, idx: number) {
        return (
          <Space>
            <span>
              <Popconfirm
                title="确认删除?"
                onConfirm={() => {
                  store.deleteEl(children![idx]);
                }}
                overlayClassName={prefixCls('setting-popconfirm')}
              >
                <MinusCircleOutlined
                  style={{ color: '#D40000', cursor: 'pointer' }}
                />
              </Popconfirm>
            </span>
            {idx === length! - 1 && (
              <span>
                <PlusIcon onClick={handleAddPanel} />
              </span>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <SettingWrap title="元素设置">
      <SettingItem label="tab类型" tips='tabType'>
        <Select
          value={tabType}
          options={['line', 'card', 'split'].map((item) => ({
            label: item,
            value: item,
          }))}
          onChange={(val) => {
            setElementProp('tabType', val as 'line' | 'card' | 'split');
          }}
        />
      </SettingItem>
      <SettingItem label="下划线" tips='underline'>
        <Switch
          size="small"
          checked={underline}
          onChange={(checked) => setElementProp('underline', checked)}
        />
      </SettingItem>
      <TableSortable
        columns={columns}
        rowKey="id"
        onSort={(newChildren: any) => {
          setElementProp('children', newChildren);
        }}
        dataSource={cloneDeep(children)}
        pagination={false}
        scroll={{ y: 300 }}
        // children字段在tabs组件中有用
        childrenColumnName="other"
      />
    </SettingWrap>
  );
};
