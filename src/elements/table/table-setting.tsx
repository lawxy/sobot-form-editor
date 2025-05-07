import React, { useCallback } from 'react';
import { Switch, Input, Select } from 'antd';
import { noop } from 'lodash-es';

import { SettingItem, SettingWrap } from '@/components';
import type { IBaseElement, TElementSetting } from '@/types';
import { ColumnsSetting } from './columns-setting';

const pageSizeOptions = ['10', '20', '50', '100'].map((item) => ({
  label: item,
  value: +item,
}));

export const SettingTable: TElementSetting = ({ element, setElementProp }) => {
  const { scrollX, scrollY, pagination, pageSize, rowKey } = element;

  const handleChange = useCallback((attr: keyof IBaseElement) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      // const number = +e.target.value;
      // const value =
      //   isNumber(number) && !isNaN(number) ? +number : e.target.value;
      // console.log('value', value);
      setElementProp(attr, e.target.value);
    };
  }, []);

  return (
    <SettingWrap title="元素设置">
      <SettingItem label="rowKey" tips='rowKey'>
        <Input value={rowKey} onChange={handleChange('rowKey')} />
      </SettingItem>

      <SettingItem label="横向滚动" tips='scrollX'>
        <Input value={scrollX} onChange={handleChange('scrollX')} />
      </SettingItem>
      <SettingItem label="纵向滚动" tips='scrollY'>
        <Input value={scrollY} onChange={handleChange('scrollY')} />
      </SettingItem>

      <SettingItem label="是否可分页" tips='pagination'>
        <Switch
          size="small"
          checked={element.pagination}
          onChange={(checked) => {
            setElementProp('pagination', checked);
          }}
        />
      </SettingItem>
      {pagination && (
        <>
          <SettingItem label="每页条数" tips='pageSize'>
            <Select
              value={pageSize}
              options={pageSizeOptions}
              onChange={(v) => setElementProp('pageSize', v)}
            />
          </SettingItem>
        </>
      )}
      <ColumnsSetting setFieldValue={noop} element={element} setElementProp={setElementProp} />
    </SettingWrap>
  );
};
