import React from 'react';
import { Input, Select } from '@sobot/soil-ui';
import { Divider, Switch } from 'antd';

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

const dateOptions = ['HH:mm:ss', 'HH:mm'].map((per) => ({
  label: per,
  value: per,
}));

export const SettingTime: TElementSetting = ({
  element,
  setElementProp,
  setFieldValue,
}) => {
  const { dateFormat, addonBefore, timeRange } = element;

  return (
    <>
      <SettingWrap title="元素设置">
        <SettingItem label="标题">
          <Input
            value={addonBefore}
            onChange={(e) => setElementProp('addonBefore', e.target.value)}
          />
        </SettingItem>
        <SettingItem label="时间格式">
          <Select
            value={element.dateFormat}
            style={{ width: '100%' }}
            options={dateOptions}
            onChange={(val) => {
              setElementProp('dateFormat', val as string);
            }}
          />
        </SettingItem>
        <SettingItem label="时间范围">
          <Switch
            size="small"
            checked={!!timeRange}
            onChange={(checked) => setElementProp('timeRange', checked)}
          />
        </SettingItem>

        {!timeRange && (
          <>
            <PlaceholderSetting />

            <DefaultDateSetting
              label="默认时间"
              fieldType="startDate"
              type="time"
            />

            {/* <DefaultValueSetting>
              {(value) => (
                <TimePicker
                  format={dateFormat}
                  value={value ? moment(`2000-01-01 ${value}`) : undefined}
                  onChange={handleChange}
                />
              )}
            </DefaultValueSetting> */}
          </>
        )}

        {timeRange && (
          <>
            <Divider />

            <SettingItem label="开始时间" />
            <PlaceholderSetting label="暗提示" field="startPlaceholder" />
            <DefaultDateSetting
              label="默认时间"
              fieldType="startDate"
              type="time"
            />
            <Divider />

            <SettingItem label="结束时间" />
            <PlaceholderSetting label="暗提示" field="endPlaceholder" />
            <DefaultDateSetting
              label="默认时间"
              fieldType="endDate"
              type="time"
            />
            <Divider />
          </>
        )}

        <AllowClear />
        <DisabledSetting />
      </SettingWrap>
      <RegPattern />
    </>
  );
};
