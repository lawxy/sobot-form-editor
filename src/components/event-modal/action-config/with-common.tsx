import React, { type FC, type PropsWithChildren } from 'react';
import { Switch, Select, InputNumber, Input } from 'antd';
import { prefixCls } from '@/const';
import type { IConfig } from '.';
import { delayOptions, EEventAction, EEventType } from '@/types';
import { QuestionPopover } from '@/components';

export const WithCommon: FC<PropsWithChildren<IConfig>> = ({
  children,
  onChange,
  eventTarget,
  event,
}) => {
  const { series, delayTime, delayType, immediately, triggerValue } = eventTarget || {};

  const needDelay = [EEventAction.ON_CLICK, EEventAction.VALUE_CHANGE].includes(
    event!.eventAction!,
  );

  return (
    <div className={prefixCls('with-series')}>
      {React.isValidElement(children) &&
        React.cloneElement<any>(children, {
          onChange,
          eventTarget,
          event,
        })}
        {
          event?.eventAction === EEventAction.VALUE_CHANGE && (
            <>
              <div>
                事件触发值
                <QuestionPopover
                  content={
                    <>
                      触发事件的值，不填则直接触发事件
                      <br />
                      按照基本数据类型填写, 比如 true 或 1 或 '1'
                    </>
                  }
                />
                &nbsp;： &nbsp;
                <Input
                  className={prefixCls('event-input')}
                  value={triggerValue}
                  onChange={(e) => onChange?.({ triggerValue: e.target.value })}
                />
              </div>
              <div>
                立即执行
                <QuestionPopover
                  content={
                    <>
                      打开以后初始值（默认值或表单值）会触发事件
                    </>
                  }
                />
                &nbsp;: &nbsp;
                <Switch
                  checked={!!immediately}
                  size="small"
                  onChange={(c) => onChange?.({ immediately: c })}
                />
              </div>
            </>
        )
      }
      {
        event?.eventType !== EEventType.LINK_SERVICE && (
          <>
            <div>
              串联
              <QuestionPopover content="打开后, 后续事件将等待此事件执行完成。若此事件抛错，将终止后续事件。" />
              &nbsp;: &nbsp;
              <Switch
                checked={!!series}
                size="small"
                onChange={(c) => onChange?.({ series: c })}
              />
            </div>
            {needDelay && (
              <div>
                事件防重
                <QuestionPopover
                  content={
                    <>
                      1. 设置防抖: 防重时间内多次触发事件只会执行最后一次。
                      <br />
                      2. 设置节流: 防重时间间隔内只允许事件执行一次。
                    </>
                  }
                />
                &nbsp;: &nbsp;
                {/* 开启事件防重后，防重时间内多次触发事件只会执行最后一次 */}
                <Select
                  allowClear
                  className={prefixCls('event-input')}
                  options={delayOptions}
                  onChange={(v) => onChange?.({ delayType: v })}
                  value={delayType}
                />
                &nbsp;
                <InputNumber
                  min={1}
                  className={prefixCls('event-input')}
                  onChange={(v) => onChange?.({ delayTime: v ? +v : 1 })}
                  value={delayTime}
                />
                ms
              </div>
            )}
          </>
        )
      }
    </div>
  );
};
