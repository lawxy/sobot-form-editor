import { IFormStore, IBaseStore } from './types';

export default {
  fieldsValue: {},

  formInstance: undefined,

  setForm(form) {
    this.formInstance = form;
  },

  removeField(field: keyof IFormStore['fieldsValue']) {
    delete this.fieldsValue[field];
    this.formInstance?.setFieldsValue(this.fieldsValue);
  },

  getFieldValue(field: string) {
    return this.fieldsValue[field];
  },

  getFieldsValue() {
    return this.fieldsValue;
  },

  setFieldValue(field: string, value: any) {
    this.fieldsValue[field] = value;
    this.formInstance?.setFields([{ name: field, value }]);
  },

  setFieldsValue(values: Record<string, any>) {
    this.fieldsValue = values;
    this.formInstance?.setFieldsValue(values);
  },
} as Pick<IBaseStore, keyof IFormStore>;
