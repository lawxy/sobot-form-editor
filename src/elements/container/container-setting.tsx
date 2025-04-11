import React from 'react';
import { InputNumber, Select } from 'antd';
import { SettingItem, SettingWrap } from '@/components';
import type { TElementSetting, TJustify, TAlign } from '@/types';
import { JustifyOptions, AlignOptions } from '@/const';

export const SettingContainer: TElementSetting = ({ element, setElementProp }) => {
  return (
    <SettingWrap title="容器设置">
      <SettingItem label="水平对齐">
        <Select
          options={JustifyOptions}
          value={element.justify}
          onChange={(value) => setElementProp('justify', value as TJustify)}
        />
      </SettingItem>
      <SettingItem label="水平间距">
        <InputNumber
          min={0}
          value={element.horizontalGap}
          onChange={(value) => {
            setElementProp('horizontalGap', Number(value));
          }}
        />
      </SettingItem>
      <SettingItem label="垂直对齐">
        <Select
            options={AlignOptions}
            value={element.align}
            onChange={(val) => {
              setElementProp('align', val as TAlign);
            }}
          />
        </SettingItem>
      <SettingItem label="垂直间距">
        <InputNumber
          min={0}
          value={element.verticalGap}
          onChange={(value) => {
            setElementProp('verticalGap', Number(value));
          }}
        />
      </SettingItem>
    </SettingWrap>
  );
};
