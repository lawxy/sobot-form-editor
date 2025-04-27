import React from 'react';
import { Select, Input } from 'antd';
import { observer } from 'mobx-react-lite';

import { prefixCls } from '@/const';
import store from '@/store';
import { linkRefreshFieldOptions, ELinkRefreshType } from '@/types';
import type { IConfig } from '.';
import { JSModal } from '@/components/js-modal';

const defaultCustomJs = `function main({ store, serviceValue, eventValue}) {
  console.log('serviceValue', serviceValue)
  console.log('eventValue', eventValue)
}
`;

const LinkService: React.FC<IConfig> = ({ onChange, eventTarget }) => {
  const {
    targetServiceId,
    linkRefreshType,
    getFieldFromService,
    customRefreshField,
    customJs
  } = eventTarget || {};

  return (
    <>
      <div>
        目标服务 ={' '}
        <Select
          className={prefixCls('event-select')}
          options={store.getFormServices()?.map((item) => ({
            label: item?.name,
            value: item?.id,
          }))}
          defaultValue={targetServiceId}
          onChange={(v) => {
            onChange?.({ targetServiceId: v });
          }}
        />
      </div>
      <div>
        获取结果字段 ={' '}
        <Input
          className={prefixCls('event-select')}
          value={getFieldFromService ?? 'data'}
          onChange={(e) => {
            onChange?.({ getFieldFromService: e.target.value });
          }}
        />
      </div>
      <div>
        更新组件{' '}
        <Select
          style={{ width: 120 }}
          options={linkRefreshFieldOptions}
          defaultValue={linkRefreshType}
          onChange={(v) => {
            onChange?.({ linkRefreshType: v });
          }}
        />{' '}
        &nbsp;
        {linkRefreshType === ELinkRefreshType.CUSTOMFIELD && (
          <Input
            defaultValue={customRefreshField}
            className={prefixCls('event-input')}
            onChange={(e) => {
              onChange?.({ customRefreshField: e.target.value });
            }}
          />
        )}
        {
          linkRefreshType === ELinkRefreshType.CUSTOMJS && (
            <JSModal
              title="自定义js"
              value={customJs || defaultCustomJs}
              hasDefaultValue={!!customJs}
              onChange={(v) => {
                onChange?.({ customJs: v });
              }}
            />
          )
        }
      </div>
    </>
  );
};

export default observer(LinkService);
