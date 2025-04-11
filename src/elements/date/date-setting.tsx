import React from 'react';
import { Select, Input, Switch } from 'antd';
import { DatePicker } from '@sobot/soil-ui'
import dayjs from 'dayjs';

import {
  SettingItem,
  SettingWrap,
  PlaceholderSetting,
  RegPattern,
  DefaultValueSetting,
  AllowClear,
  DisabledSetting,
  PlacementSetting,
} from '@/components';
import type { TElementSetting } from '@/types';
import { formatDate } from '@/utils';
import { showTimeFormat } from './const';

const dateOptions = [
  'YYYY-MM-DD',
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DD HH:mm:ss',
].map((per) => ({ label: per, value: per }));

const datePickerTypeOptions = [
  {
    label: '默认',
    value: '',
  },
  {
    label: '年',
    value: 'year',
  },
  {
    label: '月',
    value: 'month',
  },
  {
    label: '周',
    value: 'week',
  },
  {
    label: '季度',
    value: 'quarter',
  },

];

export const SettingDate: TElementSetting = ({
  element,
  setElementProp,
  setFieldValue,
}) => {
  const { dateFormat, addonBefore, datePickerType } = element;

  const handleChange = (date: Date) => {
    setFieldValue(date ? formatDate(date, dateFormat!) : undefined);
  };
  return (
    <>
      <SettingWrap title="元素设置">
        <PlaceholderSetting />

        <SettingItem label="类型">
          <Select
            value={datePickerType}
            options={datePickerTypeOptions}
            onChange={(val) => setElementProp('datePickerType', val)}
          />
        </SettingItem>
   
        {
          datePickerType === '' && (
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
          )
        }
        <DefaultValueSetting>
          {(value) => (
            <DatePicker
              format={dateFormat}
              // @ts-ignore
              value={value ? dayjs(value) : undefined}
              showTime={showTimeFormat(dateFormat!)}
              onChange={handleChange}
              placement="bottomRight"
            />
          )}
        </DefaultValueSetting>
        <SettingItem label="标题">
          <Input
            value={addonBefore}
            onChange={(e) => setElementProp('addonBefore', e.target.value)}
          />
        </SettingItem>
        <PlacementSetting />
        <AllowClear />
        <DisabledSetting />
      </SettingWrap>
      <RegPattern />
    </>
  );
};
