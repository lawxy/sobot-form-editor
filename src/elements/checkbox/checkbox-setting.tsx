import React from 'react';
import { Select } from 'antd';
import {
  OptionSetting,
  SettingWrap,
  SettingItem,
  RegPattern,
  DefaultValueSetting,
  UseGroupSetting,
} from '@/components';
import { DirectionOpions } from '@/const';
import type { TDirection, TElementSetting } from '@/types';

export const SettingCheckbox: TElementSetting = ({
  element,
  setElementProp,
  setFieldValue
}) => {
  return (
    <>
      <SettingWrap title="元素设置">
        <DefaultValueSetting>
          {(value) => (
            <Select
              allowClear
              options={element.valueOptions}
              value={value || []}
              mode="multiple"
              onChange={(val) => {
                setFieldValue(val);
              }}
            />
          )}
        </DefaultValueSetting>
        <UseGroupSetting />
        {
          element.useGroup && (
            <>
              <SettingItem label="排列方式">
                <Select
                  options={DirectionOpions}
                  value={element.direction}
                  onChange={(val) => {
                    setElementProp('direction', val as TDirection);
                  }}
                />
              </SettingItem>
              <OptionSetting />
            </>
          )
        }
      </SettingWrap>
      <RegPattern />
    </>
  );
};
