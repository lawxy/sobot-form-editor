import React, { useState, type FC, type PropsWithChildren } from 'react';
import { Modal, Button } from '@sobot/soil-ui';
import { MonacoEditor } from '@sobot/form-editor-ui';
import { useEditorContext } from '@/context';

export const PreviewLocale: FC<PropsWithChildren<any>> = ({ children }) => {
  const [openCode, setOpenCode] = useState(false);
  const { LOCALE } = useEditorContext();

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement<any>(children, {
          onClick: () => setOpenCode(true),
        })}

      <Modal
        width={600}
        visible={openCode}
        onCancel={() => {
          setOpenCode(false);
        }}
        destroyOnClose
        footer={<Button onClick={() => setOpenCode(false)}>关闭</Button>}
      >
        <div style={{ marginTop: 20 }}>
          <MonacoEditor
            language="json"
            value={JSON.stringify(LOCALE, null, 2)}
            style={{
              width: '100%',
              height: 560,
            }}
            options={{
              readOnly: true,
            }}
          />
        </div>
      </Modal>
    </>
  );
};
