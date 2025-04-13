import type { IBaseElement } from '@/types';
import { EEventAction } from '@/types';

export const ELEMENT_DATE_RANGE = 'fe-date-range';

export const DATE_RANGE_TEXT = '日期范围';

export const eventActions = [EEventAction.ON_LOADED, EEventAction.VALUE_CHANGE];

export const initialData: Partial<IBaseElement> = {
  elementName: '日期范围',
  dateFormat: 'YYYY-MM-DD',
  gridSpan: 4,
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  allowClear: true,
  datePickerType: '',
  startDateCustom: `function main(moment) {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};
`,
  endDateCustom: `function main(moment) {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};
`,
};
