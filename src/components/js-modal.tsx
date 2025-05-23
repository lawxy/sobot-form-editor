import React, { useEffect, useState, useRef } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { Button, Modal, message } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import { MonacoEditor } from '@sobot/form-editor-ui';

// 6133 6198 参数变量未使用时不校验， 7044未定义类型 2933"Duplicate function implementation."
const filterErrors = ['6133', '6198', '7044', '2393'];

export const JSModal: FC<
  PropsWithChildren<{
    title: string | React.ReactNode;
    value?: any;
    onChange?: (v: any) => void;
    style?: React.CSSProperties;
    hasDefaultValue?: boolean;
  }>
> = observer(({ children, title, value, onChange, style, hasDefaultValue }) => {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<string>('');
  const isJsonValidate = useRef<boolean>(true);
  const changed = useRef<boolean>(false);

  useEffect(() => {
    if (!open) {
      setVal(value);
    }
  }, [value, open]);

  return (
    <div>
      {
        children ? (
          React.isValidElement(children) &&
          React.cloneElement<any>(children, {
            onClick: () => setOpen(true),
          })
        ) : (
          <Button ghost={hasDefaultValue} type={hasDefaultValue ? 'primary' : 'default'} size="small" onClick={() => setOpen(true)}>编辑</Button>
        )
      }
      <Modal
        width={1200}
        visible={open}
        title={title}
        onCancel={() => {
          if (changed.current) {
            Modal.confirm({
              title: '确认不保存？',
              onOk: () => {
              setOpen(false);
              },
            });
          } else {
            setOpen(false);
          }
        }}
        maskClosable={false}
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
              height: 450,
            }
          }
          language="typescript"
          value={val}
          onChange={(v) => {
            setVal(v!);
            changed.current = true;
          }}
          onValidate={(errors) => {
            const finnalErrors = errors.filter((item: any) => !filterErrors.includes(item?.code));
            isJsonValidate.current = finnalErrors.length === 0;
            if (!isJsonValidate.current) {
              console.log('ts语法报错', finnalErrors);
            }
          }}
          options={{
            tabSize: 2,
          }}
        />
      </Modal>
    </div>
  );
});
