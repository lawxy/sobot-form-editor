import { Switch } from 'antd';
import type { TElementSetting } from '@sobot/form-editor';
import { SettingItem, SettingWrap, PlaceholderSetting } from '@sobot/form-editor';

export const TreeSelectSetting: TElementSetting = ({ element, setElementProp }) => {
  const { allowClear, canSearch } = element;
  return (
    <SettingWrap title="元素设置">
      <PlaceholderSetting />

      <SettingItem label="支持清空">
        <Switch checked={allowClear} onChange={v => setElementProp('allowClear', v)}/>
      </SettingItem>

      <SettingItem label="支持搜索">
        <Switch checked={canSearch} onChange={v => setElementProp('canSearch', v)}/>
      </SettingItem>
      
    </SettingWrap>
  );
};
