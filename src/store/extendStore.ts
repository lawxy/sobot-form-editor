import { IBaseStore, IExtendStore } from './types';

/**
 * 前端扩展属性
 */
export default {
  /**
   * 元素扩展属性
   */
  elementExtendAttrs: {},

  /**
   * 表单项扩展属性
   */
  formItemExtendAttrs: {},

  /**
   * 表单扩展属性
   */
  formExtendAttrs: {},

  getElementExtendAttrs(id: string) {
    return this.elementExtendAttrs[id] || {};
  },

  getFormItemExtendAttrs(id: string) {
    return this.formItemExtendAttrs[id] || {};
  },

  getFormExtendAttrs() {
    return this.formExtendAttrs;
  },

  setElementExtendAttr(id: string, key: string, value: any) {
    if (!this.elementExtendAttrs[id]) {
      this.elementExtendAttrs[id] = {};
    }
    this.elementExtendAttrs[id][key] = value;
  },

  setElementExtendAttrs(id: string, attrs: Record<string, any>) {
    this.elementExtendAttrs[id] = attrs;
  },

  setFormItemExtendAttr(id: string, key: string, value: any) {
    if (!this.formItemExtendAttrs[id]) {
      this.formItemExtendAttrs[id] = {};
    }
    this.formItemExtendAttrs[id][key] = value;
  },

  setFormItemExtendAttrs(id: string, attrs: Record<string, any>) {
    this.formItemExtendAttrs[id] = attrs;
  },

  setFormExtendAttr(key: string, value: any) {
    this.formExtendAttrs[key] = value;
  },

  setFormExtendAttrs(attrs: Record<string, any>) {
    this.formExtendAttrs = attrs;
  },
} as Pick<IBaseStore, keyof IExtendStore>;
