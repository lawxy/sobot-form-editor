import { useState, useEffect, useCallback } from 'react';
import SuiEditor from '@sobot/wang-editor';

import { useEditorContext } from '@sobot/form-editor';

import type { TElementRender } from '@sobot/form-editor';

export const RenderEditor: TElementRender = ({
  element,
  fieldValue,
  customStyle,
  setFieldValue,
}) => {
  const { editorMode, toolbarConfigMode, toolbarConfig } = element;
  const { mode } = useEditorContext();
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    setKey(key + 1);
  }, [toolbarConfigMode, toolbarConfig]);

  const handleChange = useCallback((v) => {
    setFieldValue(v);
  }, [setFieldValue])

  return (
    <SuiEditor
      // key={mode === 'design' ? key : ''}
      mode={editorMode}
      value={fieldValue || ''}
      style={{ ...customStyle }}
      onChange={handleChange}
      toolbarConfig={
        toolbarConfigMode === 'default' || !toolbarConfig?.length
          ? undefined
          : { toolbarKeys: toolbarConfig }
      }
    />
  );
};
