import { Table, Select, Button, type TableColumnProps } from 'antd'
import { observer } from "mobx-react-lite";
import type { FC } from 'react';
import React from 'react';


import OptionModal from './option-modal';

import { SettingItem } from '@/components/setting-item';
import { DirectionOpions } from '@/const';
import store from '@/store';
import type { TOption } from '@/types';

const columns: TableColumnProps<TOption>[] = [
  {
    title: '属性',
    dataIndex: 'label',
  },
  {
    title: '值',
    dataIndex: 'value',
  },
]

const OptionSetting:FC = () => {
  return (
    <>
      <SettingItem label='排列方式'>
        <Select 
          options={DirectionOpions} 
          value={store.selectedElement.alignDirection} 
          onChange={val => {
            store.setSelectedProp('alignDirection', val)
          }}
        />
      </SettingItem>
      <SettingItem label='选项'>
        <OptionModal>
          <Button className='fm-attr-setting-btn' size='small'>编辑</Button>
        </OptionModal>
      </SettingItem>
      <Table
        columns={columns}
        dataSource={store.selectedElement.valueOptions}
        pagination={false}
        scroll={{y: 300}}
        rowKey='id'
      />
    </>
  )
}

export default observer(OptionSetting)