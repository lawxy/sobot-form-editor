import React from 'react';
import { Tooltip } from 'antd';
import { Icons } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import { JSModal } from '@/components';
import { prefixCls } from '@/const';
import type { IConfig } from '.';


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
        <div className={prefixCls('custom-js')}>
            自定义脚本：
            <JSModal
                title={
                    <Tooltip placement="right" title="后期放个文档链接">
                        <span>
                            <span style={{ paddingRight: '4px' }}>自定义脚本设置</span>
                            <Icons name="shuoming" />
                        </span>
                    </Tooltip>
                }
                value={customJs || customJSDefaultValue}
                hasDefaultValue={!!customJs}
                onChange={(v) => {
                    onChange?.({ customJs: v });
                }}
            />
        </div>
    );
};

export default observer(CustomJs);
