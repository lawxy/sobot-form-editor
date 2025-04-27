import React from 'react';
import { DatePicker, Select, Button, TimePicker } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { EDateMode } from '@/types';
import { JSModal } from '..';
import store from '@/store';
import { SettingItem } from '../setting-common';

const dateModeOptions = [
  { label: '当前时间', value: EDateMode.NOW },
  { label: '选择器', value: EDateMode.PICKER },
  { label: '自定义', value: EDateMode.CUSTOM },
];
const timeModeOptions = [
  { label: '当前时间', value: EDateMode.NOW },
  { label: '选择器', value: EDateMode.PICKER },
];

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const timeFormat = 'HH:mm:ss';

const defaultCustomAttribute = `function main(moment) {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};
`;

interface IDefaultDateSettingProps {
  label: string;
  fieldType: 'startDate' | 'endDate';
  type: 'date' | 'time';
}

export const DefaultDateSetting = observer(
  ({ label, fieldType, type }: IDefaultDateSettingProps) => {
    const mode =
      store.selectedElement[
        fieldType === 'startDate' ? 'startDateMode' : 'endDateMode'
      ];

    const value =
      store.selectedElement[
        fieldType === 'startDate' ? 'startDate' : 'endDate'
      ];

    const customValue =
      store.selectedElement[
        fieldType === 'startDate' ? 'startDateCustom' : 'endDateCustom'
      ];

    const modeAttribute =
      fieldType === 'startDate' ? 'startDateMode' : 'endDateMode';

    const customAttribute =
      fieldType === 'startDate' ? 'startDateCustom' : 'endDateCustom';

    const Picker = type === 'date' ? DatePicker : TimePicker;

    return (
      <>
        <SettingItem label={label}>
          <Select
          allowClear
            options={type === 'date' ? dateModeOptions : timeModeOptions}
            value={mode}
            onChange={(value) =>
              store.setSelectedProp(modeAttribute, value as EDateMode)
            }
          />
        </SettingItem>
        {mode === EDateMode.PICKER && (
          <SettingItem label={''}>
            <Picker
              format={type === 'date' ? dateFormat : timeFormat}
              showTime
              value={value ? moment(value) : null}
              onChange={(date) =>
                store.setSelectedProp(
                  fieldType,
                  date ? moment(date).format(dateFormat) : undefined,
                )
              }
            />
          </SettingItem>
        )}
        {mode === EDateMode.CUSTOM && (
          <SettingItem label={''}>
            <JSModal
              title={'日期函数'}
              value={customValue || defaultCustomAttribute}
              onChange={(value) => {
                store.setSelectedProp(customAttribute, value);
              }}
            >
              <Button size="small">编辑</Button>
            </JSModal>
          </SettingItem>
        )}
      </>
    );
  },
);
