import type { IBaseElement } from '@/types';
import { EEventAction } from '@/types';

export const ELEMENT_TIME = 'fe-time';
export const TIME_TEXT = '时间';
export const eventActions = [EEventAction.ON_LOADED, EEventAction.VALUE_CHANGE];
export const initialData: Partial<IBaseElement> = {
  elementName: { langText: '时间', langKey: '' },
  dateFormat: 'HH:mm',
  gridSpan: 4,
  allowClear: true,
  placeholder: {langText: '请选择时间', langKey: ''},
  startPlaceholder: {langText: '开始时间', langKey: ''},
  endPlaceholder: {langText: '结束时间', langKey: ''},
};
