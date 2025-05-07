import type { FormInstance, FormItemProps, FormProps } from '@sobot/soil-ui';
import type {
  IBaseElement,
  IFormAttributesProps,
  TFormSerive,
  TFormSerives,
  IFormSchema,
} from '../types';

export interface IElementStore {
  formElements: IBaseElement[];

  formElementMap: Map<string, IBaseElement>;

  deleteElementMap: Map<string, IBaseElement>;

  traceActions: Array<{
    undo?: () => any;
    redo?: () => any;
  }>;

  redo: () => void;

  undo: () => void;

  tracePointer: number;

  tracing: boolean;

  addTraceAction: (action: { undo: () => any; redo: () => any }) => void;

  flatElement: (el: IBaseElement) => void;

  setFormElements: (els: IBaseElement[]) => void;

  clearAllElements: () => void;

  getElement: (
    search?: string | { id?: string; fieldName?: string },
  ) => IBaseElement | null;

  getParentChildren: (id?: string) => IBaseElement[];

  appendEl: (el: IBaseElement, selectNewElement?: boolean) => void;

  insertEl: (el: IBaseElement, idx: number) => void;

  moveElInSameParent: (
    parentId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;

  moveElInDifferentParent: (
    htmlElement: HTMLElement,
    newParentId: string,
    newIndex: number,
    fromHuman?: boolean,
  ) => void;

  dfsEl: (
    el: IBaseElement,
    callback: (el: IBaseElement) => void,
    containParent?: boolean,
  ) => void;

  deleteEl: (el: IBaseElement, move?: boolean) => Promise<boolean>;

  copyEl: (el: IBaseElement) => IBaseElement;

  selectedElement: IBaseElement;

  setSelectedElement: (el: IBaseElement) => void;

  setElementProp: <T extends keyof IBaseElement>(
    id: string,
    field: T,
    value: IBaseElement[T],
  ) => void;

  setSelectedProp: <T extends keyof IBaseElement>(
    field: T,
    value: IBaseElement[T],
  ) => void;
}
export interface IServiceStore {
  formServices: TFormSerives;
  setFormServices: (services: TFormSerives) => void;
  getFormServices: () => TFormSerives;
  addService: (serv: TFormSerive) => void;
  deleteService: (id: string) => void;
  copyService: (serv: TFormSerive) => void;
  setService: (id: string, servAttr: Partial<TFormSerive>) => void;
  getService: (id: string) => TFormSerive | undefined;
}

export interface IEditorAttrStore {
  editorAttrs: IFormAttributesProps;

  getEditorAttrs: () => IFormAttributesProps;

  getEditorAttr: (
    key: keyof IFormAttributesProps,
  ) => IFormAttributesProps[keyof IFormAttributesProps];

  setEditorAttrs: (attrs: IFormAttributesProps) => void;

  setEditorAttr: <T extends keyof IFormAttributesProps>(
    key: T,
    value: IFormAttributesProps[T],
  ) => void;
}

export interface IFormStore {
  formInstance?: FormInstance;

  setForm: (form: FormInstance) => void;

  fieldsValue: Record<string, any>;

  setFieldValue: (field: string, value: any) => void;

  setFieldsValue: (values: Record<string, any>) => void;

  removeField: (field: string) => void;

  getFieldValue: (field: keyof IFormStore['fieldsValue']) => any;

  getFieldsValue: () => Record<keyof IFormStore['fieldsValue'], any>;
}

export interface IExtendStore {
  elementExtendAttrs: Record<string, any>;

  formItemExtendAttrs: Record<string, any>;

  formExtendAttrs: Record<string, any>;

  getElementExtendAttrs: (id: string) => Record<string, any>;

  getFormItemExtendAttrs: (id: string) => FormItemProps;

  getFormExtendAttrs: () => FormProps;

  setElementExtendAttr: (id: string, key: string, value: any) => void;

  setElementExtendAttrs: (id: string, attrs: Record<string, any>) => void;

  setFormItemExtendAttr: (id: string, key: string, value: any) => void;

  setFormItemExtendAttrs: (id: string, attrs: Record<string, any>) => void;

  setFormExtendAttr: (key: string, value: any) => void;

  setFormExtendAttrs: (attrs: Record<string, any>) => void;

  extendServiceEmitter: any;
}

export type TFormTabType = 'element' | 'form' | 'service';
export interface IBaseStore
  extends IServiceStore,
    IElementStore,
    IEditorAttrStore,
    IFormStore,
    IExtendStore {
  getSchema: () => IFormSchema;
  LOCALE?: Record<string, any>;
  setLocale: (LOCALE: Record<string, any>) => void;
}
