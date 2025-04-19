import React from 'react';
import { Upload, Button, message } from '@sobot/soil-ui';
import { UploadOutlined } from '@ant-design/icons';
import type { TElementRender } from '@/types';

export const RenderUpload: TElementRender = ({
  element,
  customStyle,
  extendProps,
}) => {
  const { btnText, uploadUrl, addonAfter } = element;

  const handleChange = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  return (
    <Upload
      onChange={handleChange}
      action={uploadUrl}
      tip={addonAfter}
      style={customStyle}
      {...extendProps}
    >
      <Button icon={<UploadOutlined />}>{btnText?.langText}</Button>
    </Upload>
  );
};
