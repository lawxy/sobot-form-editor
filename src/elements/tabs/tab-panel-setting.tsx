import React from "react";
import { Switch } from "antd";
import { IBaseElement, TElementSetting, TextWithLang } from "@/types";
import { SettingWrap, SettingItem, WithLanguage } from "@/components";
import { isTabPanel } from "./const";

export const TabPanelSetting: TElementSetting = ({ element, setElementProp }) => {
  const { tooltip, id, disabled } = element;
  if (!isTabPanel(id!)) {
    return null;
  }

  return (
    <SettingWrap title="选项卡设置">
      <SettingItem label="是否禁用" tips="disabled">
        <Switch
          size="small"
          checked={!!disabled}
          onChange={(checked) => {
            setElementProp('disabled', checked);
          }}
        />
      </SettingItem>
      <SettingItem label="tooltip文案" tips="tooltip">
        <WithLanguage.Input
          value={tooltip}
          onChange={(value: TextWithLang) => {
            setElementProp('tooltip', value);
          }}
        />
      </SettingItem>
    </SettingWrap>
  )
}