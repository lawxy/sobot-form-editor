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
    tooltip,
    isFormItem,
    colon,
    showElementName,
    elementName,
    isGroup,
    hidden,
    gridLayout,
    modalOrDrawer
  } = store.selectedElement;

  const BasicSetting = () => (
    <>
      <SettingItem label="元素id">
        <div>{id}</div>
      </SettingItem>

      <SettingItem label="表单(组件)名" tips="elementName">
        <WithLanguage.Input
          value={elementName!}
          onChange={(value: TextWithLang) => {
            store.setSelectedProp('elementName', value);
          }}
          placeholder="请输入表单名称"
        />
      </SettingItem>

      <SettingItem label="字段" tips="fieldName">
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

    </>
  )

  const FormSetting = () => {
    if (isContainer || isGroup || modalOrDrawer) return null;
    return (
      <>
        <SettingItem label="表单项" tips="isFormItem">
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
            <SettingItem label="显示名称" tips="showElementName">
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
                <SettingItem label="显示冒号" tips="colon">
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
                value={tooltip}
                onChange={(value: TextWithLang) => {
                  store.setSelectedProp('tooltip', value);
                }}
              />
            </SettingItem>
          </>
        )}
      </>
    )
  }

  const GridSetting = () => {
    if (modalOrDrawer) return null;
    return (
      <>
        <SettingItem label="栅格布局" tips="gridLayout">
          <Switch
            checked={store.selectedElement?.gridLayout}
            onChange={(checked) => {
              store.setSelectedProp('gridLayout', checked);
            }}
            size="small"
          />
        </SettingItem>
        {!!gridLayout && (
          <>
            <SettingItem label="元素栅格" tips="gridSpan">
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

            <SettingItem label="元素偏移" tips="gridOffset">
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
      </>
    )
  }

  return (
    <SettingWrap title="基础设置">
      <BasicSetting />

      <FormSetting />

      <GridSetting />

      <SettingItem label="默认显示" tips="hidden">
        <Switch
          checked={!hidden}
          onChange={(checked) => {
            store.setSelectedProp('hidden', !checked);
          }}
          size="small"
        />
      </SettingItem>
    </SettingWrap>
  );
};

export default observer(BasicInfo);
