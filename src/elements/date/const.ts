import type { IBaseElement } from '@/types';
import { EEventAction } from '@/types';

export const ELEMENT_DATE = 'fe-date';

export const DATE_TEXT = '日期';

export const eventActions = [EEventAction.ON_LOADED, EEventAction.VALUE_CHANGE];

export const initialData: Partial<IBaseElement> = {
  elementName: { langText: '日期', langKey: '' },
  dateFormat: 'YYYY-MM-DD',
  gridSpan: 4,
  placeholder: {langText: '请选择日期', langKey: ''},
  allowClear: true,
  datePickerType: '',
  startDateCustom: `function main(moment) {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};
`,
};
