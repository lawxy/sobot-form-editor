import type { IBaseElement } from '@/types';
import { EEventAction } from '@/types';

export const ELEMENT_TABLE = 'fe-table';
export const TABLE_TEXT = '表格';
export const eventActions = [
  EEventAction.ON_LOADED,
  EEventAction.VALUE_CHANGE,
  EEventAction.PAGINATION_CHANGE,
];
export const initialData: Partial<IBaseElement> = {
  elementName: { langText: TABLE_TEXT, langKey: '' },
  gridSpan: 24,
  gridLayout: true,
  columns: [],
  pagination: false,
  pageSize: 10,
  current: 1,
  rowKey: 'id',
};

export const valueTypeList = [
  {
    label: '文本',
    value: 'text',
  },
  {
    label: '枚举',
    value: 'enum',
  },
];

export const columnWithOptions = ['enum'];
