import { dynamicGetStore } from '.';
import { defaultFormAttrs } from '..';
import type { IFormSchema } from '..';

export const injectSchema = (schema: IFormSchema) => {
  const store = dynamicGetStore();
  const {
    formElements = [],
    fieldsValue = {},
    editorAttrs = defaultFormAttrs,
    formServices = [],
  } = schema;
  store.setFormElements(formElements);
  store.setFieldsValue(fieldsValue);
  store.setFormAttrs(editorAttrs);
  store.setFormServices(formServices);
};
