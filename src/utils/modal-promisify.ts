import { Modal } from 'antd';
import type { ModalFuncProps } from 'antd';

export const ModalPromisify: (config: ModalFuncProps) => Promise<any> = (
  config,
) => {
  return new Promise((resolve) => {
    const { onOk, onCancel } = config;
    Modal.confirm({
      ...config,
      okText: '确定',
      cancelText: '取消',
      onOk: async (...arg: any[]) => {
        if (onOk) await onOk(...arg);
        resolve(true);
      },
      onCancel: async (...arg: any[]) => {
        if (onCancel) await onCancel(...arg);
        resolve(false);
      },
    });
  });
};
