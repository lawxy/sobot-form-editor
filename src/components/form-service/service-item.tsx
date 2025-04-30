import React from 'react';
import { Popconfirm, Popover, Typography } from '@sobot/soil-ui';
import { CopyOutlined, DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import ServiceModal from './service-modal';
import {EventRelationModal} from '../event-relation-modal';
import { prefixCls } from '@/const';
import store from '@/store';
import { TFormSerive } from '@/types';

export const ServiceItem: React.FC<{
  service: TFormSerive;
}> = ({ service }) => {
  return (
    <div className={prefixCls('service-item')}>
      <Typography.Text
        // ellipsis={{
        //   tooltip: true,
        // }}
        style={{ width: 200 }}
      >
        {service?.name}
      </Typography.Text>
      <div className={prefixCls('service-item-operate')}>

        <ServiceModal service={service}>
          <Popover content="编辑服务">
            <EditOutlined />
          </Popover>
        </ServiceModal>

        <Popover content="复制服务">
          <CopyOutlined onClick={() => store.copyService(service)} />
        </Popover>

        <EventRelationModal id={service.id!}>
          <Popover content="关联关系">
            <LinkOutlined />
          </Popover>
        </EventRelationModal>
        
        <Popconfirm
          title="确认删除?"
          placement="topLeft"
          onConfirm={() => {
            store.deleteService(service.id);
          }}
        >
          <Popover content="删除服务" placement="bottomLeft">
            <DeleteOutlined />
          </Popover>
        </Popconfirm>
      </div>
    </div>
  );
};
