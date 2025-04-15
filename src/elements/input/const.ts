import { EEventAction } from '@/types';
import type { IBaseElement } from '@/types';

export const ELEMENT_INPUT = 'fe-input';

export const INPUT_TEXT = '输入框';

export const eventActions = [
  EEventAction.ON_LOADED,
  EEventAction.VALUE_CHANGE,
  EEventAction.ON_FOCUS,
  EEventAction.ON_BLUR,
];

export const initialData: Partial<IBaseElement> = {
  elementName: { langText: '输入框', langKey: '' },
  textType: 'single',
  gridSpan: 4,
  autoSize: true,
  placeholder: {langText: '请输入', langKey: ''},
};
