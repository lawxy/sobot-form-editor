import React, { useEffect, useState, useRef } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { Modal, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { MonacoEditor } from '@sobot/form-editor-ui';

const filterErrors = ['6133', '6198'];

export const JSModal: FC<
  PropsWithChildren<{
    title: string | React.ReactNode;
    value?: any;
    onChange?: (v: any) => void;
    editorType: string;
    style?: React.CSSProperties;
  }>
> = observer(({ children, title, value, onChange, editorType, style }) => {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<string>('');
  const isJsonValidate = useRef<boolean>(true);

  useEffect(() => {
    if (!open) {
      setVal(value);
    }
  }, [value, open]);

  return (
    <div>
      {React.isValidElement(children) &&
        React.cloneElement<any>(children, {
          onClick: () => setOpen(true),
        })}
      <Modal
        width={600}
        visible={open}
        title={title}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          if (isJsonValidate.current) {
            onChange?.(val);
            setOpen(false);
            return;
          }
          message.error('格式不对');
        }}
      >
        <MonacoEditor
          style={
            style ?? {
              height: 400,
            }
          }
          language={editorType}
          value={val}
          onChange={(v) => setVal(v!)}
          onValidate={(errors) => {
            // console.log('errors', errors);
            // 6133 6198 参数变量未使用时不校验
            isJsonValidate.current =
              errors.filter((item: any) => !filterErrors.includes(item?.code))
                .length === 0;
          }}
          options={{
            tabSize: 2,
          }}
        />
      </Modal>
    </div>
  );
});
