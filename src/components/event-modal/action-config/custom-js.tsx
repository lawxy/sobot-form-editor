import React from 'react';
import { Button, Input, Switch, Tooltip } from 'antd';
import { observer } from 'mobx-react-lite';
import { JSModal } from '@/components';
import { prefixCls } from '@/const';
import type { IConfig } from '.';
import { TipsIcon } from '@sobot/soil-ui';


const customJSDefaultValue = `function main({store, eventValue, prevFunctionReturn}) {
    const {
      setElementProp,
      setFieldValue,
      setFieldsValue,
      getElement,
    } = store;
    console.log(eventValue)
  
    
  }`;

const CustomJs: React.FC<IConfig> = ({ onChange, eventTarget }) => {
    const { customJs } = eventTarget || {};

    return (
        <JSModal
            title={
                <Tooltip placement="right" title="后期放个文档链接">
                    <span>
                        <span style={{ paddingRight: '4px' }}>自定义脚本设置</span>
                        <TipsIcon />
                    </span>
                </Tooltip>
            }
            editorType="javascript"
            value={customJs || customJSDefaultValue}
            onChange={(v) => {
                onChange?.({ customJs: v });
            }}
        >
            <Button size="small">编辑</Button>
        </JSModal>
    );
};

export default observer(CustomJs);
