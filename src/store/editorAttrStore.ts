import { IFormAttributesProps } from '@/types';
import { IEditorAttrStore, IBaseStore } from './types';

export default {
  /**
   * 编辑器表单属性
   */
  editorAttrs: {},

  getEditorAttrs() {
    return this.editorAttrs;
  },

  getEditorAttr(key: keyof IFormAttributesProps) {
    return this.editorAttrs[key];
  },

  setEditorAttrs(attrs: IFormAttributesProps) {
    this.editorAttrs = attrs;
  },

  setEditorAttr(key, value) {
    this.editorAttrs[key] = value;
  },
} as Pick<IBaseStore, keyof IEditorAttrStore>;
