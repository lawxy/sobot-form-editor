import type { IBaseElement } from '@/types';

export const ELEMENT_UPLOAD = 'fe-upload';
export const UPLOAD_TEXT = '上传';
export const eventActions = [];
export const initialData: Partial<IBaseElement> = {
  elementName: { langText: '上传', langKey: '' },
  btnText: { langText: 'Upload', langKey: '' },
  gridSpan: 2,
};
