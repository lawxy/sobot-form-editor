import React, { useCallback } from 'react';
import { Switch, Input, Select } from '@sobot/soil-ui';
import { isNumber } from 'lodash-es';

import { SettingItem, SettingWrap } from '@sobot/form-editor';
import type { IBaseElement, TElementSetting } from '@sobot/form-editor';
import { ColumnsSetting } from './columns-setting';

const pageSizeOptions = ['10', '20', '50', '100'].map((item) => ({
  label: item,
  value: +item,
}));

export const SettingTable: TElementSetting = ({ element, setElementProp }) => {
  const { scrollX, scrollY, pagination, pageSize } = element;

  const handleChange = useCallback((attr: keyof IBaseElement) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const number = +e.target.value;
      const value =
        isNumber(number) && !isNaN(number) ? +number : e.target.value;
      // console.log('value', value);
      setElementProp(attr, value);
    };
  }, []);

  return (
    <SettingWrap title="元素设置">
      <SettingItem label="横向滚动宽度">
        <Input value={scrollX} onChange={handleChange('scrollX')} />
      </SettingItem>
      <SettingItem label="纵向滚动高度">
        <Input value={scrollY} onChange={handleChange('scrollY')} />
      </SettingItem>

      <SettingItem label="是否可分页">
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
          <SettingItem label="每页条数">
            <Select
              value={pageSize}
              options={pageSizeOptions}
              onChange={(v) => setElementProp('pageSize', v)}
            />
          </SettingItem>
        </>
      )}
      <ColumnsSetting element={element} setElementProp={setElementProp} />
    </SettingWrap>
  );
};
