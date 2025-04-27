import React from 'react';
import { Select } from 'antd';

import { prefixCls } from '@/const';
import { EValidateRange, validateTypeOptions } from '@/types';
import { getElementOptions } from '@/utils';
import type { IConfig } from '.';

const Validate: React.FC<IConfig> = ({ onChange, eventTarget }) => {
  const { validateRange, validateFields } = eventTarget || {};

  return (
    <>
      <div>
        校验范围：
        <Select
          allowClear
          style={{ width: 150 }}
          className={prefixCls('event-select')}
          options={validateTypeOptions}
          defaultValue={validateRange}
          onChange={(v) => {
            onChange?.({ validateRange: v });
          }}
        />
      </div>

      {
        validateRange === EValidateRange.CUSTOM && (
          <div>
            选择组件：
            <Select
              allowClear
              style={{ width: 150 }}
              className={prefixCls('event-select')}
              options={getElementOptions()}
              mode="multiple"
              defaultValue={validateFields}
              onChange={(v) => {
                onChange?.({ validateFields: v });
              }}
          />
        </div>
      )}
    </>
  );
};

export default Validate;
