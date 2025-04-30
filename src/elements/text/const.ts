import { EEventAction } from '@/types';
import type { IBaseElement } from '@/types';

export const ELEMENT_TEXT = 'fe-text';

export const TEXT_TEXT = '文本框';

export const eventActions = [EEventAction.ON_LOADED, EEventAction.VALUE_CHANGE, EEventAction.ON_CLICK,  ];

export const initialData: Partial<IBaseElement> = {
  elementName: { langText: '文本框', langKey: '' },
  gridSpan: 4,
  placeholder: {langText: '请选择时间', langKey: ''},
  openValue: 'true',
  closeValue: 'false',
  text: { langText: '文本框', langKey: '' },
  defaultValue: 'false',
};
