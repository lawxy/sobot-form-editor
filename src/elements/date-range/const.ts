import type { IBaseElement } from '@/types';
import { EDateRangeType, EEventAction } from '@/types';

export const ELEMENT_DATE_RANGE = 'fe-date-range';

export const DATE_RANGE_TEXT = '日期范围';

export const eventActions = [EEventAction.ON_LOADED, EEventAction.VALUE_CHANGE];

export const initialData: Partial<IBaseElement> = {
  elementName: { langText: '日期范围', langKey: '' },
  dateFormat: 'YYYY-MM-DD',
  gridSpan: 4,
  startPlaceholder: { langText: '开始日期', langKey: '' },
  endPlaceholder: { langText: '结束日期', langKey: '' },
  allowClear: true,
  datePickerType: '',
  dateRangeType: EDateRangeType.SYSTEM,
  datePresets: [],
  dateRangeVersion: 'default',
  startDateCustom: `function main(moment) {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};
`,
  endDateCustom: `function main(moment) {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};
`,
};
