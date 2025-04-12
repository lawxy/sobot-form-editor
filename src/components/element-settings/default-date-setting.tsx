import React from 'react';
import { DatePicker, Select, Button } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { EDateMode } from '@/types';
import { AttributesSetting } from './attributes-setting';
import store from '@/store';
import { SettingItem } from '../setting-common';

const dateModeOptions = [
  { label: '当前时间', value: EDateMode.NOW },
  { label: '选择器', value: EDateMode.PICKER },
  { label: '自定义', value: EDateMode.CUSTOM },
];

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const defaultCustomAttribute = `function main(moment) {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};
`;

interface IDefaultDateSettingProps {
  label: string;
  type: 'startDate' | 'endDate';
}

export const DefaultDateSetting = observer(
  ({ label, type }: IDefaultDateSettingProps) => {
    const mode =
      store.selectedElement[
        type === 'startDate' ? 'startDateMode' : 'endDateMode'
      ];

    const value =
      store.selectedElement[type === 'startDate' ? 'startDate' : 'endDate'];

    const customValue =
      store.selectedElement[
        type === 'startDate' ? 'startDateCustom' : 'endDateCustom'
      ];

    const modeAttribute =
      type === 'startDate' ? 'startDateMode' : 'endDateMode';

    const valueAttribute = type === 'startDate' ? 'startDate' : 'endDate';

    const customAttribute =
      type === 'startDate' ? 'startDateCustom' : 'endDateCustom';

    return (
      <>
        <SettingItem label={label}>
          <Select
            options={dateModeOptions}
            value={mode}
            onChange={(value) =>
              store.setSelectedProp(modeAttribute, value as EDateMode)
            }
          />
        </SettingItem>
        {mode === EDateMode.PICKER && (
          <SettingItem label={''}>
            <DatePicker
              format={dateFormat}
              showTime
              value={value ? moment(value) : null}
              onChange={(date) =>
                store.setSelectedProp(
                  valueAttribute,
                  date ? date?.format(dateFormat) : undefined,
                )
              }
            />
          </SettingItem>
        )}
        {mode === EDateMode.CUSTOM && (
          <SettingItem label={''}>
            <AttributesSetting
              title={'日期函数'}
              value={customValue || defaultCustomAttribute}
              onChange={(value) => {
                console.log('value', value);
                store.setSelectedProp(customAttribute, value);
              }}
              editorType="javascript"
            >
              <Button size="small">编辑</Button>
            </AttributesSetting>
          </SettingItem>
        )}
      </>
    );
  },
);
