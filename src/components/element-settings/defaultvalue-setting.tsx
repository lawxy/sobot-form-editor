import React from 'react';
import type { ConsumerProps, FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Input } from 'antd';
import { SettingItem } from '../setting-common';
import store from '../../store';

const DefaultValueSettingContent: FC<
  { label?: string } & Partial<ConsumerProps<any>>
> = ({ children, label }) => {
  const { defaultValue } = store.selectedElement || {};
  return (
    <SettingItem label={label ?? '默认值'}>
      {children ? (
        children(defaultValue)
      ) : (
        <Input
          value={defaultValue}
          onChange={(e) => {
            store.setSelectedProp('defaultValue', e.target.value);
            // store.removeField(id!);
          }}
        />
      )}
    </SettingItem>
  );
};

export const DefaultValueSetting = observer(DefaultValueSettingContent);
