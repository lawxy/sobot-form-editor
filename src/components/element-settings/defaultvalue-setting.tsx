import React from 'react';
import type { ConsumerProps, FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Input } from 'antd';
import { WithLanguage } from '../with-language';
import { SettingItem } from '../setting-common';
import store from '../../store';
import type { TextWithLang } from '../../types';
const DefaultValueSettingContent: FC<
  { label?: string } & Partial<ConsumerProps<any>>
> = ({ children, label }) => {
  const { defaultValue } = store.selectedElement || {};
  return (
    <SettingItem label={label ?? '默认值'}>
      {children ? (
        children(defaultValue)
      ) : (
        <WithLanguage.Input
          value={defaultValue}
          onChange={(val: TextWithLang) => {
            store.setSelectedProp('defaultValue', val);
            // store.removeField(id!);
          }}
        />
      )}
    </SettingItem>
  );
};

export const DefaultValueSetting = observer(DefaultValueSettingContent);
