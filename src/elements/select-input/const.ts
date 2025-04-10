import { EEventAction } from '@/types';
import type { IBaseElement } from '@/types';

export const ELEMENT_SELECT_INPUT = 'fe-select-input';

export const SELECT_INPUT_TEXT = '组合框';

export const eventActions = [
  EEventAction.ON_LOADED,
  EEventAction.VALUE_CHANGE,
  EEventAction.ON_FOCUS,
  EEventAction.ON_BLUR,
  EEventAction.ON_SEARCH,
];

export const initialData: Partial<IBaseElement> = {
  elementName: '组合框',
  gridSpan: 4,
  placeholder: '请选择',
};
