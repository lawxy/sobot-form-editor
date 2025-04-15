import type { IBaseElement } from '@/types';

export const ELEMENT_TEXT = 'fe-text';

export const TEXT_TEXT = '文本框';

export const eventActions = [];

export const initialData: Partial<IBaseElement> = {
  elementName: { langText: '文本框', langKey: '' },
  gridSpan: 4,
  placeholder: {langText: '请选择时间', langKey: ''},
};
