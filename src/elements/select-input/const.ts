import type { IBaseElement } from '@/types';
import { initialData as Select_initData, ELEMENT_SELECT } from '../select';
import { initialData as Input_initData, ELEMENT_INPUT } from '../input';
import { idCreator } from '@/utils';

export const ELEMENT_SELECT_INPUT = 'fe-select-input';

export const SELECT_INPUT_TEXT = 'select-input';

export const eventActions = [];

const selectInputCss = `/* 组件样式 */\n#el{\n\t\n} \n /* 容器样式 */\n#container{\n\tpadding: 0;\n}`

export const getChildren = (parentId: string) => {
  return [
    {
      ...Select_initData,
      type: ELEMENT_SELECT,
      id: idCreator('select'),
      customCss: selectInputCss,
      parentId
    },
    {
      ...Input_initData,
      type: ELEMENT_INPUT,
      id: idCreator('input'),
      customCss: selectInputCss,
      parentId
    }
  ]
}

export const initialData: Partial<IBaseElement> = {
  elementName: { langText: SELECT_INPUT_TEXT, langKey: '' },
  isGroup: true,
};
