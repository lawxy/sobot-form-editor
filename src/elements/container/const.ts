import type { IBaseElement } from '@/types';

export const ELEMENT_CONTAINER = 'fe-container';

export const CONTAINER_TEXT = '容器';

export const eventActions = [];

export const initialData: Partial<IBaseElement> = {
  elementName: { langText: '容器', langKey: '' },
  gridSpan: 24,
  gridLayout: true,
  children: [],
  isContainer: true,
  justify: 'start',
  align: 'top',
  horizontalGap: 0,
  verticalGap: 0,
  direction: 'horizontal',
};
