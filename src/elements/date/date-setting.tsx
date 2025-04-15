import React from 'react';
import { Select, Input } from 'antd';

import {
  SettingItem,
  SettingWrap,
  PlaceholderSetting,
  RegPattern,
  AllowClear,
  DisabledSetting,
  PlacementSetting,
  DefaultDateSetting,
  WithLanguage,
} from '@/components';
import type { TElementSetting, TextWithLang } from '@/types';
import { dateOptions, datePickerTypeOptions } from '@/utils';

export const SettingDate: TElementSetting = ({
  element,
  setElementProp,
}) => {
  const { addonBefore, datePickerType } = element;

  return (
    <>
      <SettingWrap title="元素设置">
        <PlaceholderSetting />

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

        <DefaultDateSetting
          label="默认日期"
          fieldType="startDate"
          type="date"
        />
        <SettingItem label="标题">
          <WithLanguage.Input
            value={addonBefore!}
            onChange={(val: TextWithLang) => setElementProp('addonBefore', val)}
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
