import type { IBaseElement } from '@/types';

export const ELEMENT_TABS = 'fe-tabs';

export const TABS_TEXT = 'tabs';

export const eventActions = [];

export const initialData: Partial<IBaseElement> = {
  elementName: { langText: 'tabs', langKey: '' },
  gridSpan: 24,
  gridLayout: true,
  tabType: 'line',
  children: [],
  isContainer: true,
};
