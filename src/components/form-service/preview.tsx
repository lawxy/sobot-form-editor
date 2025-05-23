import React, { useState } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { FormInstance, Modal, message } from '@sobot/soil-ui';
import { type AxiosRequestConfig } from 'axios';
import { QueryMethod, DEFAULT_ERROR_MESSAGE } from '@/const';
import { parseJs, createRequest } from '@/utils';

export const Preview: FC<
  PropsWithChildren<{
    form: FormInstance;
  }>
> = ({ children, form }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const handlePreview = async () => {
    setLoading(true);
    try {
      const formData = await form.validateFields();
      const { url, method, contentType } = formData;
      let { previewData, interceptors } = formData;
      console.log('previewData', previewData);
      previewData = await parseJs({
        jsFunction: previewData,
        valueWhenError: {},
      });

      const request = createRequest({ interceptors, contentType });

      const config: AxiosRequestConfig = { url, method };
      const dataKey = QueryMethod.includes(method) ? 'params' : 'data';

      config[dataKey] = previewData;
      setData(await request(config));
      setOpen(true);
    } catch (e) {
      message.error(DEFAULT_ERROR_MESSAGE);
    }
    setLoading(false);
  };

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement<any>(children, {
          onClick: handlePreview,
          loading,
        })}
      <Modal
        visible={open}
        title="预览结果"
        onCancel={() => {
          setOpen(false);
        }}
        bodyStyle={{
          height: 500,
          overflow: 'auto',
        }}
        okButtonProps={{
          style: { display: 'none' },
        }}
        cancelText="关闭"
      >
        <pre>
          <code
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      </Modal>
    </>
  );
};
