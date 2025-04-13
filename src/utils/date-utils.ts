export const showTimeFormat = (dateFormat: string) => {
  const [, timeFormat] = dateFormat?.split(' ');
  if (!timeFormat) return false;
  const res: Record<string, true> = {};
  if (timeFormat.includes('HH')) res.showHour = true;
  if (timeFormat.includes('mm')) res.showMinute = true;
  if (timeFormat.includes('ss')) res.showSecond = true;
  if (Object.keys(res).length === 0) return false;
  return res;
};

export const dateOptions = [
  'YYYY-MM-DD',
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DD HH:mm:ss',
].map((per) => ({ label: per, value: per }));

export const datePickerTypeOptions = [
  {
    label: '默认',
    value: '',
  },
  {
    label: '年',
    value: 'year',
  },
  {
    label: '月',
    value: 'month',
  },
  {
    label: '周',
    value: 'week',
  },
  {
    label: '季度',
    value: 'quarter',
  },
];
