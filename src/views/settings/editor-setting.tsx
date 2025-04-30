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

const EditorSetting = () => {
  const { id, editorName, horizontalGap, verticalGap, layout } =
    store.editorAttrs;

  return (
    <div className={prefixCls('editor-setting')}>
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
          <SettingItem label="编辑器id">{id}</SettingItem>
          <SettingItem label="编辑器名称">
            <Input
              value={editorName}
              onChange={(e) => {
                store.setEditorAttr<'editorName'>('editorName', e.target.value);
              }}
            />
          </SettingItem>

          <SettingItem label="布局">
            <Select
              options={DirectionOpions}
              value={layout}
              onChange={(val) => {
                store.setEditorAttr<'layout'>('layout', val as TDirection);
              }}
            />
          </SettingItem>

          <SettingItem label="水平间隔">
            <InputNumber
              value={horizontalGap}
              min={0}
              onChange={(val) => {
                store.setEditorAttr<'horizontalGap'>(
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
                store.setEditorAttr<'verticalGap'>('verticalGap', Number(val));
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

export default observer(EditorSetting);
