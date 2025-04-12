import { dynamicGetStore } from '.';
import { defaultFormAttrs } from '..';
import type { IFormSchema } from '..';

export const injectSchema = (schema: IFormSchema) => {
  const store = dynamicGetStore();
  const {
    formElements = [],
    fieldValues = {},
    editorAttrs = defaultFormAttrs,
    formServices = [],
  } = schema;
  store.setFormElements(formElements);
  store.setFieldsValues(fieldValues);
  store.setFormAttrs(editorAttrs);
  store.setFormServices(formServices);
};
