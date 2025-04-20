import React from 'react';
import { Input, Switch } from 'antd';
import { observer } from 'mobx-react-lite';

import { prefixCls } from '@/const';
import type { IConfig } from '.';

const JumpLink: React.FC<IConfig> = ({ onChange, eventTarget }) => {
  const { jumpUrl, newWindow } = eventTarget || {};

  return (
    <>
      跳转url:{' '}
      <Input
        className={prefixCls('event-select')}
        defaultValue={jumpUrl}
        onChange={(e) => {
          onChange?.({ jumpUrl: e.target.value });
        }}
      />
      <div>
        新窗口打开：
        <Switch
          checked={newWindow}
          onChange={(checked) => {
            onChange?.({ newWindow: checked });
          }}
        />
      </div>
    </>
  );
};

export default observer(JumpLink);
