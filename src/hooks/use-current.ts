import store from '@/store';

export const useCurrent = (type: 'element' | 'form') => {
  if (type === 'element') {
    return {
      current: store.selectedElement,
      setProp: store.setSelectedProp as any,
    };
  }
  return {
    current: store.editorAttrs,
    setProp: store.setEditorAttr as any,
  };
};
