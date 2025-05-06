import React, { useMemo } from 'react';
import { Select, Switch } from 'antd';
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
  WithLanguage,
} from '@/components';
import type { TElementSetting, TextWithLang } from '@/types';
import { parseText } from '@/utils';
export const SettingSelect: TElementSetting = ({
  element,
  setElementProp,
  setFieldValue,
}) => {
  const { multiple, options, addonBefore, labelWrapperStyle } = element;

  const selectOptions = useMemo(() => {
    return options?.map((opt) => ({
      ...opt,
      label: parseText(opt.label),
    }));
  }, [options]);

  return (
    <>
      <SettingWrap title="元素设置">
        <DefaultValueSetting>
          {(value) => (
            <Select
              options={selectOptions}
              mode={multiple ? 'multiple' : undefined}
              value={value}
              onChange={(v) => {
                setElementProp('defaultValue', v);
                // setFieldValue(v);
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
        <SettingItem label="前缀" tips='addonBefore'>
          <WithLanguage.Input
            value={addonBefore!}
            onChange={(val: TextWithLang) => setElementProp('addonBefore', val)}
          />
        </SettingItem>

        {parseText(addonBefore) && (
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
            tips='labelWrapperStyle'
          />
        )}

        <SettingItem label="多选模式" style={{ marginTop: 20 }} tips='multiple'>
          <Switch
            size="small"
            checked={!!element.multiple}
            onChange={(v) => setElementProp('multiple', v)}
          />
        </SettingItem>
        {element.multiple && (
          <SettingItem label="多选文本形式" tips='tagRenderText'>
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
