import React from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react-lite';

import store from '@/store';
import { prefixCls } from '@/const';
import {
  changeStateActions,
  EChangeStatePayload,
  type IEventTarget,
} from '@/types';
import type { IConfig } from '.';

const SetElementValue: React.FC<IConfig> = ({ onChange, eventTarget }) => {
  const { targetElementId, targetPayload, setValue, customJs } =
    eventTarget || {};

  // console.log('targetElementId', targetElementId);
  const getComponentsOptions = () => {
    const options = [];
    // @ts-ignore
    for (const el of store.formElementMap.values()) {
      options.push({
        label: (
          <div
            dangerouslySetInnerHTML={{
              __html: el?.elementName?.langText || (el.id as string),
            }}
          />
        ),
        value: el.id,
        // disabled: store.selectedElement.id === el.id,
      });
    }
    return options;
  };

  return (
    <>
      <div>
        目标组件：{' '}
        <Select
          allowClear
          className={prefixCls('event-input')}
          options={getComponentsOptions()}
          style={{ width: 200 }}
          value={targetElementId}
          onChange={(v) => {
            onChange?.({ targetElementId: v });
          }}
        />
      </div>
      {targetElementId && (
        <div>
          事件动作：&nbsp;
          <Select
            style={{ width: 200 }}
            className={prefixCls('event-input')}
            options={changeStateActions(
              // @ts-ignore
              [
                EChangeStatePayload.SHOW,
                EChangeStatePayload.HIDDEN,
                EChangeStatePayload.SYNC,
                EChangeStatePayload.RESET_PAGE,
              ].filter(Boolean),
            )}
            key="action"
            value={targetPayload}
            onChange={(v) => {
              const prop: Partial<IEventTarget> = { targetPayload: v };
              onChange?.(prop);
            }}
          />
        </div>
      )}
    </>
  );
};

export default observer(SetElementValue);
