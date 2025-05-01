import type { IBaseElement } from '@/types';
import { EEventAction } from '@/types';
export const ELEMENT_TABS = 'fe-tabs';

export const ELEMENT_TAB_PANEL = 'fe-tab-panel';

export const TABS_TEXT = 'tabs';

export const eventActions = [EEventAction.ON_LOADED, EEventAction.VALUE_CHANGE];

export const initialData: Partial<IBaseElement> = {
  elementName: { langText: 'tabs', langKey: '' },
  gridSpan: 24,
  gridLayout: true,
  tabType: 'line',
  children: [],
  isContainer: true,
};

export const isTabs = (id: string) => id.includes(ELEMENT_TABS);
export const isTabPanel = (id: string) => id.includes(ELEMENT_TAB_PANEL);