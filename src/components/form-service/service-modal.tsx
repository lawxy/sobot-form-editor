import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Radio } from '@sobot/soil-ui';
import { observer } from 'mobx-react-lite';
import type { FC, PropsWithChildren } from 'react';

import { prefixCls, RequestMethod } from '@/const';
import store from '@/store';
import { TFormSerive } from '@/types';
import { idCreator } from '@/utils';
import { Preview } from './preview';

import { JSModal } from '..';

const defaultInterceptor = `axios.interceptors.request.use(config =>{
  return config
})

const DEFAULT_ERROR_MESSAGE = '请求服务报错';

const HttpStatusCode = { Ok: 200 };

axios.interceptors.response.use(function (res) {
  try {
    const { code } = res.data || {};
    if (HttpStatusCode.Ok === code) {
      return res.data;
    }
    message.error(errMsg || DEFAULT_ERROR_MESSAGE);
  } catch (e) {
    message.error(DEFAULT_ERROR_MESSAGE);
  }
},
function (err) {
  message.error(err?.message || DEFAULT_ERROR_MESSAGE);
  return Promise.reject(err);
})
`;

const ServiceModal: FC<
  PropsWithChildren<{
    service?: TFormSerive;
  }>
> = ({ children, service }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const methodOptions = RequestMethod.map((item) => ({
    label: item,
    value: item,
  }));

  const contentTypeOptions = [
    { label: 'json', value: 'application/json' },
    { label: 'form-data', value: 'multipart/form-data' },
    {
      label: 'urlencoded',
      value: 'application/x-www-form-urlencoded',
    },
  ];

  const getDefaultService = (serv?: TFormSerive) => {
    if (serv?.id) return serv;
    return {
      interceptors: defaultInterceptor,
    };
  };
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement<any>(children, {
          onClick: () => setOpen(true),
        })}
      <Modal
        visible={open}
        title={`${service ? '编辑' : '新增'}服务`}
        maskClosable={false}
        destroyOnClose
        bodyStyle={{
          height: 500,
          overflow: 'auto',
        }}
        onCancel={() => {
          setOpen(false);
        }}
        // onOk={async () => {
        //   await form.validateFields();
        //   const serviceValue = form.getFieldsValue();
        //   if (service) {
        //     store.setService(service.id, serviceValue);
        //   } else {
        //     serviceValue.id = idCreator('service');
        //     store.addService(serviceValue);
        //   }
        //   setOpen(false);
        // }}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            取消
          </Button>,
          <Preview form={form} key="preview">
            <Button>预览</Button>
          </Preview>,
          <Button
            key="ok"
            type="primary"
            onClick={async () => {
              await form.validateFields();
              const serviceValue = form.getFieldsValue();
              if (service) {
                store.setService(service.id, serviceValue);
              } else {
                serviceValue.id = idCreator('service');
                store.addService(serviceValue);
              }
              setOpen(false);
            }}
          >
            确定
          </Button>,
        ]}
        // footer={(_, { OkBtn, CancelBtn }) => (
        //   <>
        //     <CancelBtn />
        //     <Preview form={form}>
        //       <Button>预览</Button>
        //     </Preview>
        //     <OkBtn />
        //   </>
        // )}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={getDefaultService(service)}
        >
          <Form.Item
            name="name"
            label="名称"
            required
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="url"
            label="接口名"
            required
            rules={[
              {
                required: true,
              },
              {
                type: 'url',
                message: '格式不正确, 请以http或者https开头',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="method"
            label="请求方法"
            required
            rules={[{ required: true }]}
          >
            <Select options={methodOptions} showSearch />
          </Form.Item>
          <Form.Item
            name="contentType"
            label="请求格式"
            required
            initialValue="application/json"
          >
            <Radio.Group options={contentTypeOptions} />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              return (
                <>
                  <Form.Item
                    className={prefixCls('service-modal-form-item')}
                    name="interceptors"
                    label={
                      <div
                        className={prefixCls('service-modal-form-item-label')}
                      >
                        <span>拦截器设置</span>
                        <JSModal
                          title="拦截器设置"
                          value={form.getFieldValue('interceptors')}
                          onChange={(v) => {
                            form.setFieldsValue({
                              ...form.getFieldsValue(),
                              interceptors: v,
                            });
                          }}
                          style={{ height: 600 }}
                        >
                          <Button size="small">编辑</Button>
                        </JSModal>
                      </div>
                    }
                  >
                    <Input.TextArea readOnly />
                  </Form.Item>

                  <Form.Item
                    className={prefixCls('service-modal-form-item')}
                    name="previewData"
                    shouldUpdate
                    label={
                      <div
                        className={prefixCls('service-modal-form-item-label')}
                      >
                        <span>预览参数</span>
                        <JSModal
                          title="编辑参数"
                          value={
                            getFieldValue('previewData') ||
                            'function main() {\n\treturn {\n\t\t\n\t}\n}'
                          }
                          onChange={(v) => {
                            form.setFieldsValue({
                              ...form.getFieldsValue(),
                              previewData: v,
                            });
                          }}
                        >
                          <Button size="small">编辑</Button>
                        </JSModal>
                      </div>
                    }
                  >
                    <Input.TextArea readOnly />
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default observer(ServiceModal);
