import { makeAutoObservable } from 'mobx';
import elementStore from './elementStore';
import serviceStore from './serviceStore';
import editorAttrStore from './editorAttrStore';
import extendAttrStore from './extendStore';
import formStore from './formStore';
import { IBaseStore } from './types';
export * from './tabStore';

const extendStore = (store: Record<string, any>, _this: any) => {
  Object.entries(store).forEach(([key, value]) => {
    if (typeof value === 'function') {
      _this[key] = value.bind(_this);
    } else {
      _this[key] = value;
    }
  });
};

const baseStore: IBaseStore = Object.assign(
  {},
  elementStore,
  serviceStore,
  editorAttrStore,
  formStore,
  extendAttrStore,
) as IBaseStore;

class Store {
  [key: string]: any;

  constructor() {
    /* eslint-disable */
    extendStore(baseStore, this);
    makeAutoObservable(this);
  }

  setLocale(LOCALE: Record<string, any>) {
    this.LOCALE = LOCALE;
  }

  getSchema() {
    return {
      formElements: this.formElements,
      fieldsValue: this.fieldsValue,
      editorAttrs: this.editorAttrs,
      formServices: this.formServices,
    };
  }
}

export default new Store() as IBaseStore;
