import React from 'react';
import { Tabs } from 'antd';
import { ApartmentOutlined, AppstoreOutlined } from '@ant-design/icons';
import { prefixCls } from '@/const';
import { Material } from './material';
import { ElementTree } from './element-tree';
import './style.less'

const { TabPane } = Tabs;

export const SideBar: React.FC = () => {
    return (
        <div className={prefixCls('editor-side-bar')}>
            <Tabs tabPosition="left">
                <TabPane tab={<AppstoreOutlined className={prefixCls('editor-side-bar-icon')} />} key="1">
                    <Material />
                </TabPane>
                <TabPane tab={<ApartmentOutlined className={prefixCls('editor-side-bar-icon')} />} key="2">
                    <ElementTree />
                </TabPane>
            </Tabs>
        </div>
    );
};