import { IFormStore, IBaseStore } from './types';

export default {
  fieldValues: {},

  formInstance: undefined,

  setForm(form) {
    this.formInstance = form;
  },

  removeField(field: keyof IFormStore['fieldValues']) {
    delete this.fieldValues[field];
    this.formInstance?.setFieldsValue(this.fieldValues);
  },

  getFieldValue(field: string) {
    return this.fieldValues[field];
  },

  getFieldValues() {
    return this.fieldValues;
  },

  setFieldValue(field: string, value: any) {
    this.fieldValues[field] = value;
    // this.formInstance?.setFieldValue(field, value);
    this.formInstance?.setFields([{ name: field, value }]);
  },

  setFieldsValue(values: Record<string, any>) {
    this.fieldValues = values;
    this.formInstance?.setFieldsValue(values);
  },
} as Pick<IBaseStore, keyof IFormStore>;
