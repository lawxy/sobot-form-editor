import { EEventAction } from '@/types';
import type { IBaseElement } from '@/types';
import { ELEMENT_CONTAINER, initialData as containerInitData } from '../container/const';
import { ELEMENT_BUTTON, initialData as buttonInitData } from '../button/const';
import { idCreator } from '@/utils';

export const ELEMENT_MODAL = 'fe-modal';
export const MODAL_TEXT = '弹窗';
export const eventActions = [EEventAction.ON_CLICK, EEventAction.ON_LOADED];

export const createContent = (parentId: string): IBaseElement => {
  return {
    type: ELEMENT_CONTAINER,
    id: idCreator('modal-content'),
    parentId,
    cannotCopy: true,
    ...containerInitData,
    elementName: {
      langText: '弹窗内容',
      langKey: ''
    },
  }
}

export const createFooter = (parentId: string): IBaseElement => {
  const id = idCreator('modal-footer');
  return {
      type: ELEMENT_CONTAINER,
      id,
      parentId,
      cannotCopy: true,
      ...containerInitData,
      justify: 'end',
      horizontalGap: 8,
      elementName: {
        langText: '弹窗底部',
        langKey: ''
      },
      children: [
        {
          type: ELEMENT_BUTTON,
          id: idCreator('cancel-button'),
          parentId: id,
          ...buttonInitData,
          elementName: {
            langText: '取消按钮',
            langKey: ''
          },
          text: {
            langText: '取消',
            langKey: ''
          }
        },
        {
          type: ELEMENT_BUTTON,
          id: idCreator('confirm-button'),
          parentId: id,
          ...buttonInitData,
          elementName: {
            langText: '确定按钮',
            langKey: ''
          },
          btnType: 'primary',
          text: {
            langText: '确定',
            langKey: ''
          }
        }
      ]
    }
}


export const initialData: Partial<IBaseElement> = {
  elementName: {langText: '弹窗', langKey: ''},
  title: {langText: '弹窗', langKey: ''},
  gridSpan: 2,
  modalOrDrawer: true,
  hidden: false,
  mask: true,
  maskClosable: true,
};
