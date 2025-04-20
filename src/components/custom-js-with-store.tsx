import React from 'react';
import { Button, Tooltip, TipsIcon } from '@sobot/soil-ui';
import { parseJs } from '@/utils';
import { JSModal } from '.';

const defaultValue = `function main(value, store) {
  const {
    setElementProp,
    setSelectedProp,
    setFieldValue,
    setFieldsValue,
    getElement,
  } = store;
   console.log(value)

  
}`;

export const CustomJsWithStore = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
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
      value={value || defaultValue}
      onChange={onChange}
    >
      <Button size="small">编辑</Button>
    </JSModal>
  );
};
