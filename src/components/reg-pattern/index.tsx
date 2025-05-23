import React from 'react';
import { Switch, Input, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { cloneDeep } from 'lodash-es';
import { idCreator } from '@/utils';
import store from '@/store';
import { prefixCls } from '@/const';
import type { TextWithLang, TPattern } from '@/types';
import { EditInput } from './edit-input';
import { SettingItem, SettingWrap, WithLanguage } from '..';
import './style.less';

const requiredPattern: TPattern = {
  required: true,
  name: '必填',
  message: { langText: '该项必填', langKey: '' },
  enable: false,
  id: idCreator('regexp'),
};

const defaultPattern: TPattern = {
  name: '自定义正则',
  message: { langText: '', langKey: '' },
  enable: false,
};

export const RegPattern = observer(() => {
  if(!store.selectedElement?.isFormItem) return null;

  const regExps = store.selectedElement?.regExps ?? [requiredPattern];

  const handleChange = <T extends keyof TPattern>(
    idx: number,
    field: T,
    value: TPattern[T],
  ) => {
    const newRegExps: TPattern[] = cloneDeep(regExps);
    newRegExps[idx][field] = value;
    store.setSelectedProp('regExps', newRegExps);
  };

  const handleAdd = () => {
    store.setSelectedProp('regExps', [
      ...regExps,
      { ...defaultPattern, id: idCreator('regexp') },
    ]);
  };

  const handleDelete = (idx: number) => {
    const newRegExps: TPattern[] = cloneDeep(regExps);
    newRegExps.splice(idx, 1);
    store.setSelectedProp('regExps', newRegExps);
  };

  return (
    <SettingWrap title="校验">
      <div className={prefixCls('patter-item')}>
        <SettingItem label="必填">
          <Switch
            checked={regExps[0]?.enable}
            onChange={(checked) => handleChange(0, 'enable', checked)}
            size="small"
          />
        </SettingItem>
        {regExps[0]?.enable && (
          <SettingItem label="错误提示">
            <WithLanguage.Input
              value={regExps[0]?.message}
              onChange={(val: TextWithLang) => handleChange(0, 'message', val)}
            />
          </SettingItem>
        )}
      </div>
      {regExps?.slice(1)?.map((patternItem: TPattern, i: number) => {
        return (
          <div key={patternItem.id} className={prefixCls('patter-item')}>
            <SettingItem
              label={
                <EditInput
                  value={patternItem.name}
                  onChange={(val) => {
                    handleChange(i + 1, 'name', val);
                  }}
                />
              }
            >
              <Switch
                checked={patternItem.enable}
                onChange={(checked) => handleChange(i + 1, 'enable', checked)}
                size="small"
              />
              <Popconfirm
                title="确认删除"
                onConfirm={() => handleDelete(i + 1)}
              >
                <DeleteOutlined className={prefixCls('delete-icon')} />
              </Popconfirm>
            </SettingItem>
            {patternItem.enable && (
              <>
                {!patternItem.required && (
                  <SettingItem label="表达式">
                    <Input
                      value={patternItem.regexp}
                      prefix="/"
                      suffix="/"
                      onChange={(e) =>
                        handleChange(i + 1, 'regexp', e.target.value)
                      }
                    />
                  </SettingItem>
                )}
                <SettingItem label="错误提示">
                  <WithLanguage.Input
                    value={patternItem.message}
                    onChange={(val: TextWithLang) =>
                        handleChange(i + 1, 'message', val)
                    }
                  />
                </SettingItem>
              </>
            )}
          </div>
        );
      })}
      <Button
        type="dashed"
        onClick={handleAdd}
        className={prefixCls('pattern-add-button')}
      >
        + 新增自定义正则
      </Button>
    </SettingWrap>
  );
});
