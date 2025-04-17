import React from 'react';
import { Input, InputNumber, Select } from 'antd';
import { observer } from 'mobx-react-lite';

import {
  SettingItem,
  SettingWrap,
  EventSetting,
  FormCssSetting,
} from '@/components';
import { EEventAction, EEventType, TDirection } from '@/types';
import store from '@/store';
import { prefixCls, DirectionOpions } from '@/const';

const FormSetting = () => {
  const { id, formName, horizontalGap, verticalGap, layout } =
    store.editorAttrs;

  return (
    <div className={prefixCls('form-setting')}>
      <div
        style={{
          flex: 1,
          height: 0,
          overflow: 'auto',
          paddingLeft: 100,
          marginLeft: -100,
        }}
      >
        <SettingWrap title="基本属性">
          <SettingItem label="表单id">{id}</SettingItem>
          <SettingItem label="表单名称">
            <Input
              value={formName}
              onChange={(e) => {
                store.setFormAttr<'formName'>('formName', e.target.value);
              }}
            />
          </SettingItem>

          <SettingItem label="表单布局">
            <Select
              options={DirectionOpions}
              value={layout}
              onChange={(val) => {
                store.setFormAttr<'layout'>('layout', val as TDirection);
              }}
            />
          </SettingItem>

          <SettingItem label="水平间隔">
            <InputNumber
              value={horizontalGap}
              min={0}
              onChange={(val) => {
                store.setFormAttr<'horizontalGap'>(
                  'horizontalGap',
                  Number(val),
                );
              }}
            />
          </SettingItem>

          <SettingItem label="垂直间隔">
            <InputNumber
              value={verticalGap}
              min={0}
              onChange={(val) => {
                store.setFormAttr<'verticalGap'>('verticalGap', Number(val));
              }}
            />
          </SettingItem>
        </SettingWrap>

        <SettingWrap title="事件">
          <EventSetting
            type="form"
            eventActions={[EEventAction.FORM_LOADED]}
            eventTypeOptions={[EEventType.UPDATE_SERVICE]}
          />
        </SettingWrap>

        <SettingWrap title="样式">
          <FormCssSetting />
        </SettingWrap>
      </div>
    </div>
  );
};

export default observer(FormSetting);
