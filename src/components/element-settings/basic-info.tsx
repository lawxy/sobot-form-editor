import React from 'react';
import { Input, Select, Slider, Switch } from 'antd';
import { observer } from 'mobx-react-lite';
import { DirectionOpions } from '../../const';
import store from '../../store';
import type { TDirection, TextWithLang } from '../../types';
import { SettingItem, SettingWrap } from '../setting-common';
import { WithLanguage } from '../with-language';

const BasicInfo = () => {
  const {
    gridSpan,
    id,
    gridOffset,
    fieldName,
    isContainer,
    fieldTooltip,
    isFormItem,
    colon,
    showElementName,
    elementName,
  } = store.selectedElement;
  return (
    <SettingWrap title="基础设置">
      {!isContainer && (
        <>
          <SettingItem label="字段">
            <Input
              value={fieldName}
              onChange={(e) => {
                const inputValue = e.target.value;

                const formValue = store.getFieldValue(fieldName! || id!);

                store.removeField(id!);

                if (fieldName) {
                  store.removeField(fieldName);
                }

                if (formValue) {
                  store.setFieldValue(inputValue! || id!, formValue);
                }

                store.setSelectedProp('fieldName', inputValue);
              }}
            />
          </SettingItem>
          <SettingItem label="表单项">
            <Switch
              size="small"
              checked={!!isFormItem}
              onChange={(checked) => {
                store.setSelectedProp('isFormItem', checked);
              }}
            />
          </SettingItem>

          {isFormItem && (
            <>
              <SettingItem label="表单名称">
                <WithLanguage.Input
                  value={elementName!}
                  onChange={(value: TextWithLang) => {
                    store.setSelectedProp('elementName', value);
                  }}
                  placeholder="请输入表单名称"
                />
              </SettingItem>
              <SettingItem label="显示名称">
                <Switch
                  checked={showElementName}
                  onChange={(checked) => {
                    store.setSelectedProp('showElementName', checked);
                  }}
                  size="small"
                />
              </SettingItem>

              {
                showElementName && (
                  <SettingItem label="显示冒号">
                    <Switch
                      size="small"
                      checked={!!colon}
                      onChange={(checked) => {
                        store.setSelectedProp('colon', checked);
                      }}
                    />
                  </SettingItem>
                )
              }
              
              <SettingItem label="字段提示" tips="tooltip">
                <WithLanguage.Input
                  value={fieldTooltip}
                  onChange={(value: TextWithLang) => {
                    store.setSelectedProp('fieldTooltip', value);
                  }}
                />
              </SettingItem>
            </>
          )}
        </>
      )}

      <SettingItem label="元素id">
        <div>{id}</div>
      </SettingItem>

      {/* <SettingItem label="名称对齐">
        <Select
          options={DirectionOpions}
          value={store.selectedElement.elementNameDisplay || 'vertical'}
          onChange={(val: TDirection) => {
            store.setSelectedProp('elementNameDisplay', val);
          }}
        />
      </SettingItem> */}
      <SettingItem label="栅格布局">
        <Switch
          checked={store.selectedElement?.gridLayout}
          onChange={(checked) => {
            store.setSelectedProp('gridLayout', checked);
          }}
          size="small"
        />
      </SettingItem>
      {store.selectedElement?.gridLayout && (
        <>
          <SettingItem label="元素栅格">
            <div style={{ width: '90%' }}>
              <Slider
                value={gridSpan}
                max={24}
                min={1}
                onChange={(v) => {
                  store.setSelectedProp('gridSpan', v);
                }}
              />
            </div>
          </SettingItem>

          <SettingItem label="元素偏移">
            <div style={{ width: '90%' }}>
              <Slider
                value={gridOffset}
                max={24}
                min={0}
                onChange={(v) => {
                  store.setSelectedProp('gridOffset', v);
                }}
              />
            </div>
          </SettingItem>
        </>
      )}
    </SettingWrap>
  );
};

export default observer(BasicInfo);
