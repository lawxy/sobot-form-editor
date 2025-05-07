import { createContext, useContext } from 'react';
import type { TMode, IFormSchema, TDragElementObject } from './types';

export interface IEditorContext {
  mode: TMode;
  isDesign: boolean;
  LOCALE: Record<string, string>;
  actionProp?: {
    previewUrl?: string;
    onSave?: (param: IFormSchema) => any;
    download?: (param: IFormSchema) => any;
  };
  ElementsMap: TDragElementObject;
}

export const EditorContext = createContext<IEditorContext>(
  {} as IEditorContext,
);

export const useEditorContext = () => {
  return useContext(EditorContext);
};
