import React from 'react';
import { Select, Input, Divider } from 'antd';

import {
  SettingItem,
  SettingWrap,
  PlaceholderSetting,
  RegPattern,
  AllowClear,
  DisabledSetting,
  PlacementSetting,
  DefaultDateSetting,
} from '@/components';
import type { TElementSetting } from '@/types';
import { dateOptions, datePickerTypeOptions } from '@/utils';

export const SettingDateRange: TElementSetting = ({
  element,
  setElementProp,
}) => {
  const { addonBefore, datePickerType } = element;

  return (
    <>
      <SettingWrap title="元素设置">
        <SettingItem label="标题">
          <Input
            value={addonBefore}
            onChange={(e) => setElementProp('addonBefore', e.target.value)}
          />
        </SettingItem>

        <SettingItem label="日期类型">
          <Select
            value={datePickerType}
            options={datePickerTypeOptions}
            onChange={(val) => setElementProp('datePickerType', val)}
          />
        </SettingItem>

        {datePickerType === '' && (
          <SettingItem label="日期格式">
            <Select
              value={element.dateFormat}
              style={{ width: '100%' }}
              options={dateOptions}
              onChange={(val) => {
                setElementProp('dateFormat', val);
              }}
            />
          </SettingItem>
        )}

        <Divider />
        <SettingItem label="开始时间" />
        <PlaceholderSetting label="暗提示" field="startPlaceholder" />
        <DefaultDateSetting
          label="默认时间"
          fieldType="startDate"
          type="date"
        />
        <Divider />

        <SettingItem label="结束时间" />
        <PlaceholderSetting label="暗提示" field="endPlaceholder" />
        <DefaultDateSetting label="默认时间" fieldType="endDate" type="date" />
        <Divider />

        {/* <DefaultDateSetting
          label="默认日期"
          fieldType="startDate"
          type="date"
        /> */}

        {/* <PlacementSetting /> */}
        <AllowClear />
        <DisabledSetting />
      </SettingWrap>
      <RegPattern />
    </>
  );
};
