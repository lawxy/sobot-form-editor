import { IFormAttributesProps } from '@/types';
import { IEditorAttrStore, IBaseStore } from './types';

export default {
  /**
   * 编辑器表单属性
   */
  editorAttrs: {},

  setFormAttrs(attrs: IFormAttributesProps) {
    this.editorAttrs = attrs;
  },

  setFormAttr(key, value) {
    this.editorAttrs[key] = value;
  },
} as Pick<IBaseStore, keyof IEditorAttrStore>;
