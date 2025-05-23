import React from 'react';
import { Select, Tree, TreeSelect } from 'antd';
import { observer } from 'mobx-react-lite';
import store from '@/store';
import { prefixCls } from '@/const';
import {
  changeStateActions,
  EChangeStatePayload,
  type IEventTarget,
} from '@/types';
import { getElementOptions, getElementTree } from '@/utils';
import type { IConfig } from '.';

const SetElement: React.FC<IConfig> = ({ onChange, eventTarget }) => {
  const { targetElementId, targetPayload } =
    eventTarget || {};

  const filter = (action: EChangeStatePayload) => {
    const el = store.getElement(targetElementId);
    const parentEl = store.getElement(el?.parentId);
    if (parentEl?.isGroup) {
      return action !== EChangeStatePayload.SHOW && action !== EChangeStatePayload.HIDDEN;
    }
    return true;
  }

  return (
    <>
      <div>
        目标组件：{' '}
        <TreeSelect
          allowClear
          className={prefixCls('event-select')}
          treeData={getElementTree()}
          value={targetElementId}
          onChange={(v) => {
            onChange?.({ targetElementId: v, targetPayload: undefined });
          }}
            />
        {/* <Select
          allowClear
          className={prefixCls('event-input')}
          options={getElementOptions()}
          style={{ width: 200 }}
          value={targetElementId}
          onChange={(v) => {
            onChange?.({ targetElementId: v, targetPayload: undefined });
          }}
        /> */}
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
              ].filter(filter),
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

export default observer(SetElement);
