import { Button } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { ServiceItem } from './service-item';
import ServiceModal from './service-modal';

import { prefixCls } from '@/const';
import store from '@/store';
import type { TFormSerive } from '@/types';
import './style.less';

export const FormService = observer(() => {
  return (
    <div className={prefixCls('form-service-wrap')}>
      <ServiceModal>
        <Button type="dashed" className={prefixCls('add-button')}>
          + 新增服务
        </Button>
      </ServiceModal>
      {store.formServices?.map((serv: TFormSerive) => {
        return <ServiceItem key={serv.id} service={serv} />;
      })}
    </div>
  );
});
