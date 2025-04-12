import moment, { type Moment } from 'moment';

export const formatDate = (date: Moment, format: string): string => {
  return moment(date).format(format) || '';
};
