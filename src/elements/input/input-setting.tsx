import React from 'react';
import { Input, InputNumber, Select, Switch } from 'antd';

import {
  PlaceholderSetting,
  RegPattern,
  SettingItem,
  SettingWrap,
  DefaultValueSetting,
  AllowClear,
  DisabledSetting,
  WithLanguage,
  // CustomAttributesSetting
} from '@/components';
import type { TElementSetting, TextWithLang } from '@/types';

const typeOptions = [
  { label: '单行文本', value: 'single' },
  { label: '多行文本', value: 'multiple' },
  { label: '密码框', value: 'password' },
];

export const SettingInput: TElementSetting = ({ element, setElementProp }) => {
  const {
    textType,
    minRows,
    maxRows,
    autoSize,
    showCount,
    minNum,
    maxNum,
    addonBefore,
    addonAfter,
  } = element;
  return (
    <>
      <SettingWrap title="元素设置">
        <DefaultValueSetting />
        <PlaceholderSetting />
        <SettingItem label="文本类型">
          <Select
            value={textType}
            style={{ width: '100%' }}
            options={typeOptions}
            onChange={(val) => {
              setElementProp(
                'textType',
                val as 'single' | 'multiple' | 'password',
              );
            }}
          />
        </SettingItem>
        <DisabledSetting />
        <AllowClear />
        <SettingItem label="显示字数">
          <Switch
            size="small"
            checked={showCount}
            onChange={(val) => {
              setElementProp('showCount', val);
            }}
          />
        </SettingItem>

        <SettingItem label="最小长度">
          <InputNumber
            value={minNum}
            min={0}
            style={{ width: '100%' }}
            onChange={(val) => {
              setElementProp('minNum', Number(val));
            }}
          />
        </SettingItem>
        <SettingItem label="最大长度">
          <InputNumber
            value={maxNum}
            min={1}
            style={{ width: '100%' }}
            onChange={(val) => {
              setElementProp('maxNum', Number(val));
            }}
          />
        </SettingItem>
        {textType === 'single' && (
          <>
            <SettingItem label="前缀">
              <WithLanguage.Input
                value={addonBefore!}
                onChange={(val: TextWithLang) =>
                  setElementProp('addonBefore', val)
                }
              />
            </SettingItem>
            <SettingItem label="后缀">
              <WithLanguage.Input
                value={addonAfter!}
                onChange={(val: TextWithLang) =>
                  setElementProp('addonAfter', val)
                }
              />
            </SettingItem>
          </>
        )}
        {textType === 'multiple' && (
          <>
            <SettingItem label="自适应行数">
              <Switch
                size="small"
                checked={autoSize}
                onChange={(val) => {
                  setElementProp('autoSize', val);
                }}
              />
            </SettingItem>
            {!autoSize && (
              <>
                <SettingItem label="最小行数">
                  <InputNumber
                    value={minRows}
                    style={{ width: '100%' }}
                    onChange={(val) => {
                      setElementProp('minRows', Number(val));
                    }}
                  />
                </SettingItem>
                <SettingItem label="最大行数">
                  <InputNumber
                    value={maxRows}
                    min={minRows}
                    style={{ width: '100%' }}
                    onChange={(val) => {
                      setElementProp('maxRows', Number(val));
                    }}
                  />
                </SettingItem>
              </>
            )}
          </>
        )}
      </SettingWrap>
      <RegPattern />
    </>
  );
};
