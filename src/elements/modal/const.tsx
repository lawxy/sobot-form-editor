import { EEventAction } from '@/types';
import type { IBaseElement } from '@/types';
import { ELEMENT_CONTAINER, initialData as containerInitData } from '../container/const';
import { idCreator } from '@/utils';

export const ELEMENT_MODAL = 'fe-modal';
export const MODAL_TEXT = '弹窗';
export const eventActions = [EEventAction.ON_CLICK, EEventAction.ON_LOADED];

export const getChildren = (parentId: string) => {
  return [
    {
      type: ELEMENT_CONTAINER,
      id: idCreator('container'),
      parentId,
      ...containerInitData
    },
  ]
}

export const initialData: Partial<IBaseElement> = {
  elementName: {langText: '弹窗', langKey: ''},
  gridSpan: 2,
  modalOrDrawer: true,
};
