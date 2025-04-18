import React, { useState, type FC, type PropsWithChildren } from 'react';
import { Modal, Button } from '@sobot/soil-ui';
import { MonacoEditor } from '@sobot/form-editor-ui';
import store from '@/store';

export const PreviewSchema: FC<PropsWithChildren<any>> = ({ children }) => {
  const [openCode, setOpenCode] = useState(false);

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
            value={JSON.stringify(store.getSchema(), null, 2)}
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
