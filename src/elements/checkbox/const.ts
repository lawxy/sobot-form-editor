import type { IBaseElement } from '@/types';
import { EEventAction } from '@/types';

export const ELEMENT_CHECKBOX = 'fe-checkbox';
export const CHECKBOX_TEXT = '多选';
export const eventActions = [EEventAction.ON_LOADED, EEventAction.VALUE_CHANGE];
export const initialData: Partial<IBaseElement> = {
  elementName: { langText: '多选', langKey: '' },
  gridSpan: 10,
  direction: 'horizontal',
  options: [
    { label: { langText: '选项1', langKey: '' }, value: '1', id: '1' },
    { label: { langText: '选项2', langKey: '' }, value: '2', id: '2' },
  ],
  useGroup: true,
};
