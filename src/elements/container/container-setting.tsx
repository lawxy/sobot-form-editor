import React from 'react';
import { InputNumber, Select } from 'antd';
import { SettingItem, SettingWrap } from '@/components';
import type { TElementSetting, TJustify, TAlign, TDirection } from '@/types';
import { JustifyOptions, AlignOptions, DirectionOpions } from '@/const';
import { TabPanelSetting } from '../tabs/tab-panel-setting';

export const SettingContainer: TElementSetting = (props) => {
  const { element, setElementProp } = props;
  return (
    <>
      <SettingWrap title="容器设置">
        <SettingItem label="主轴方向" tips='direction'>
          <Select
            options={DirectionOpions}
            value={element.direction}
            onChange={(value) => setElementProp('direction', value as TDirection)}
          />
        </SettingItem>
        <SettingItem label="水平对齐" tips='justify'>
          <Select
            options={JustifyOptions}
            value={element.justify}
            onChange={(value) => setElementProp('justify', value as TJustify)}
          />
        </SettingItem>
        <SettingItem label="水平间距" tips='horizontalGap'>
          <InputNumber
            min={0}
            value={element.horizontalGap}
            onChange={(value) => {
              setElementProp('horizontalGap', Number(value));
            }}
          />
        </SettingItem>
        <SettingItem label="垂直对齐" tips='align'>
          <Select
            options={AlignOptions}
            value={element.align}
            onChange={(val) => {
              setElementProp('align', val as TAlign);
            }}
          />
        </SettingItem>
        <SettingItem label="垂直间距" tips='verticalGap'>
          <InputNumber
            min={0}
            value={element.verticalGap}
            onChange={(value) => {
              setElementProp('verticalGap', Number(value));
            }}
          />
        </SettingItem>
      </SettingWrap>
      <TabPanelSetting {...props} />
    </>
  );
};
