import React from 'react';
import { Select, Input, Tabs, Divider, TreeSelect } from '@sobot/soil-ui';

import {
  SettingItem,
  SettingWrap,
  PlaceholderSetting,
  RegPattern,
  AllowClear,
  DisabledSetting,
  DefaultDateSetting,
} from '@/components';
import type { TElementSetting } from '@/types';
import { EDateRangeType } from '@/types';
import { dateOptions, datePickerTypeOptions } from '@/utils';
import { CustomRangeSetting } from './custom-range';

const dateRangeTypeOptions = [
  { label: '系统预设', value: EDateRangeType.SYSTEM },
  { label: '自定义', value: EDateRangeType.CUSTOM },
];

const presetOptions = [
  { title: '今天', key: 'TODAY' },
  { title: '本周', key: 'THIS_WEEK' },
  { title: '上周', key: 'LAST_WEEK' },
  { title: '本月', key: 'THIS_MONTH' },
  { title: '上月', key: 'LAST_MONTH' },
  { title: '最近7天', key: 'LATELY_7_DAYS' },
  { title: '最近30天', key: 'LATELY_30_DAYS' },
  { title: '最近1年', key: 'LATELY_1_YEAR' },
  { title: '过去7天', key: 'LAST_7_DAYS' },
  { title: '过去30天', key: 'LAST_30_DAYS' },
];

const dateRangeVersionOptions = [
  { label: '默认', value: 'default' },
  { label: 'v2版本', value: 'v2' },
];

export const SettingDateRange: TElementSetting = ({
  element,
  setElementProp,
}) => {
  const { addonBefore, datePickerType, dateFormat, dateRangeType, datePresets, dateRangeVersion } = element;

  return (
    <>
      <SettingWrap title="元素设置">
        <SettingItem label="版本" tips="RangePicker | RangePickerV2">
          <Select
            value={dateRangeVersion}
            options={dateRangeVersionOptions}
            onChange={(val) => setElementProp('dateRangeVersion', val as any)}
          />
        </SettingItem>

        <SettingItem label="标题" tips='label'>
          <Input
            value={addonBefore}
            onChange={(e) => setElementProp('addonBefore', e.target.value)}
          />
        </SettingItem>
        
        <SettingItem label="日期类型" tips='picker'>
          <Select
            value={datePickerType}
            options={datePickerTypeOptions}
            onChange={(val) => setElementProp('datePickerType', val as any)}
          />
        </SettingItem>

        <SettingItem label="日期格式" tips='format'>
          <Select
            value={dateFormat}
            options={dateOptions}
            onChange={(val) => setElementProp('dateFormat', val as any)}
          />
        </SettingItem>

        <SettingItem label="范围选择" tips='presets | ranges'>
          <Select
            value={dateRangeType} 
            options={dateRangeTypeOptions}
            onChange={(val) => setElementProp('dateRangeType', val as any)}
          />
        </SettingItem>

        {dateRangeType === EDateRangeType.SYSTEM && (
          <>
            <SettingItem label="">
            <TreeSelect
                search={false}
                allowClear
                value={datePresets}
                notree
                treeData={presetOptions}
                onChange={(val: any) => {
                  setElementProp('datePresets', val || []);
                }}
              />
            </SettingItem>
          </>
        )}

        {dateRangeType === EDateRangeType.CUSTOM && (
          <CustomRangeSetting />
        )}

        <Tabs
          items={[
            {
              key: 'start',
              label: '开始时间',
              children: (
                <>
                  <PlaceholderSetting label="暗提示" field="startPlaceholder" />
                  <DefaultDateSetting
                    label="默认时间"
                    fieldType="startDate"
                    type="date"
                  />
                </>
              ),
            },
            {
              key: 'end',
              label: '结束时间',
              children: (
                <>
                  <PlaceholderSetting label="暗提示" field="endPlaceholder" />
                  <DefaultDateSetting
                    label="默认时间"
                    fieldType="endDate"
                    type="date"
                  />
                </>
              ),
            },
          ]}
        />
        <Divider style={{ marginTop: 0 }} />
        <AllowClear />
        <DisabledSetting />
      </SettingWrap>
      <RegPattern />
    </>
  );
};
