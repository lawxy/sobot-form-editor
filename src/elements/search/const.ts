import { EEventAction } from '@/types';
import type { IBaseElement } from '@/types';

export const ELEMENT_SEARCH = 'fe-search';

export const SEARCH_TEXT = '搜索框';

export const eventActions = [
  EEventAction.ON_LOADED,
  EEventAction.VALUE_CHANGE,
  EEventAction.ON_FOCUS,
  EEventAction.ON_BLUR,
  EEventAction.ON_SEARCH,
];

export const initialData: Partial<IBaseElement> = {
  elementName: { langText: '搜索框', langKey: '' },
  gridSpan: 4,
  placeholder: {langText: '请输入', langKey: ''},
};
