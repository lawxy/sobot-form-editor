import { idCreator } from './utils';

export const prefixCls = (className: string) => `fe-${className}`;

export const DirectionOpions = [
  {
    label: '垂直方向',
    value: 'vertical',
  },
  {
    label: '水平方向',
    value: 'horizontal',
  },
];

export const AlignOptions = [
  {
    label: 'top',
    value: 'top',
  },
  {
    label: 'middle',
    value: 'middle',
  },
  {
    label: 'bottom',
    value: 'bottom',
  },
];

export const JustifyOptions = [
  {
    label: 'start',
    value: 'start',
  },
  {
    label: 'center',
    value: 'center',
  },
  {
    label: 'end',
    value: 'end',
  },
  {
    label: 'space-between',
    value: 'space-between',
  },
  {
    label: 'space-around',
    value: 'space-around',
  },
  
];

export const defaultFormAttrs = {
  id: idCreator('form'),
  horizontalGap: 8,
  verticalGap: 8,
  justify: 'start',
  align: 'top',
  customCss: '#form {\n\tpadding: 10px;\n}',
};

export const DEFAULT_ERROR_MESSAGE = '请求服务报错';

export const FILTER_ELEMENT = [];

export const RequestMethod = [
  'GET',
  'POST',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'PUT',
  'PURGE',
  'LINK',
  'UNLINK',
];
export const QueryMethod = [
  'GET',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'LINK',
  'UNLINK',
];
