import React from 'react';
import { Input, Select, Switch } from 'antd';
import {
  OptionSetting,
  SettingWrap,
  PlaceholderSetting,
  RegPattern,
  DefaultValueSetting,
  SettingItem,
  AllowClear,
  DisabledSetting,
  CanSearchSetting,
  CustomCssSetting,
} from '@/components';
import type { TElementSetting } from '@/types';

export const SettingSelect: TElementSetting = ({
  element,
  setElementProp,
  setFieldValue,
}) => {
  const { multiple, valueOptions, addonBefore, labelWrapperStyle } = element;
  return (
    <>
      <SettingWrap title="元素设置">
        <DefaultValueSetting>
          {(value) => (
            <Select
              options={valueOptions}
              mode={multiple ? 'multiple' : undefined}
              value={value}
              onChange={(v) => {
                setFieldValue(v);
              }}
              placeholder="默认值选择"
              allowClear
            />
          )}
        </DefaultValueSetting>
        <PlaceholderSetting />
        <DisabledSetting />
        <AllowClear />
        <CanSearchSetting />
        <SettingItem label="前缀">
          <Input
            value={addonBefore}
            onChange={(e) => setElementProp('addonBefore', e.target.value)}
          />
        </SettingItem>

        {addonBefore && (
          <CustomCssSetting
            label="带标题样式"
            defaultValue={labelWrapperStyle || `.labelWrapperStyle {\n\t\t\n}`}
            style={{
              marginBottom: 30,
            }}
            editorStyle={{
              height: 70,
            }}
            onSave={(v) => setElementProp('labelWrapperStyle', v)}
          />
        )}

        <SettingItem label="多选模式" style={{ marginTop: 20 }}>
          <Switch
            size="small"
            checked={!!element.multiple}
            onChange={(v) => setElementProp('multiple', v)}
          />
        </SettingItem>
        {element.multiple && (
          <SettingItem label="多选文本形式">
            <Switch
              size="small"
              checked={!!element.tagRenderText}
              onChange={(v) => setElementProp('tagRenderText', v)}
            />
          </SettingItem>
        )}
        <OptionSetting />
      </SettingWrap>
      <RegPattern />
    </>
  );
};
