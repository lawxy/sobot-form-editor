import React, { useState, useEffect } from 'react';
import type { FC, PropsWithChildren } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  InputNumber,
  Select,
  Button,
  Switch,
} from 'antd';
import type { TColumn } from '@/types';
import { OptionModal, WithLanguage } from '@/components';
import type { TextWithLang } from '@/types';
import { valueTypeList, columnWithOptions } from '../const';

const WithLanguageInput = ({value, onChange}: {value?: TextWithLang, onChange?: (val: TextWithLang) => void}) => {
  return <WithLanguage.Input value={value} onChange={onChange} />
}

export const EditModal: FC<
  PropsWithChildren<{
    onChange: (v: TColumn) => void;
    initialValues?: TColumn;
  }>
> = ({ children, onChange, initialValues }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open || !initialValues) {
      return form.resetFields();
    }
    form.setFieldsValue(initialValues);
  }, [initialValues, open]);

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement<any>(children, {
          onClick() {
            setOpen(true);
          },
        })}
      <Modal
        title="列设置"
        forceRender
        visible={open}
        onCancel={() => {
          setOpen(false);
        }}
        maskClosable={false}
        onOk={async () => {
          try {
            const values = await form.validateFields();
            onChange({ ...initialValues, ...values });
            setOpen(false);
          } catch (e) {}
        }}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="列标题"
            name="title"
            required
            rules={[{ required: true, message: '必填' }]}
          >
            <WithLanguageInput />
          </Form.Item>
          <Form.Item
            label="字段"
            name="dataIndex"
          >
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="valueType" initialValue="text">
            <Select options={valueTypeList} />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue, setFieldsValue, getFieldsValue }) => (
              <>
                {columnWithOptions.includes(getFieldValue('valueType')) && (
                  <Form.Item label="选项" name="options">
                    <OptionModal
                      options={getFieldValue('options') || []}
                      onChange={(options) => {
                        console.log('options', options)
                        setFieldsValue({ ...getFieldsValue(), options });
                      }}
                    >
                      <Button size="small">编辑</Button>
                    </OptionModal>
                  </Form.Item>
                )}
              </>
            )}
          </Form.Item>
          <Form.Item label="宽度" name="width" tooltip='注意带单位, 如100px'>
            <WithLanguageInput />
          </Form.Item>
          <Form.Item label="对齐方式" name="align" initialValue="left">
            <Radio.Group>
              <Radio.Button value="left">左对齐</Radio.Button>
              <Radio.Button value="center">居中</Radio.Button>
              <Radio.Button value="right">右对齐</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="是否固定" name="fixed" initialValue="">
            <Radio.Group>
              <Radio.Button value="">不固定</Radio.Button>
              <Radio.Button value="left">固定左侧</Radio.Button>
              <Radio.Button value="right">固定右侧</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
