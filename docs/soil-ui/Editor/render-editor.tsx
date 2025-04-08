import { useState, useEffect } from 'react';
import SuiEditor from '@sobot/wang-editor';

import type { TElementRender } from '@sobot/form-editor';

export const RenderEditor: TElementRender = ({
  element,
  fieldValue,
  customStyle,
  setFieldValue,
}) => {
  const { editorMode, toolbarConfigMode, toolbarConfig } = element;
  console.log('toolbarConfig', toolbarConfig)
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    setKey(key + 1);
  }, [toolbarConfigMode, toolbarConfig]);

  return (
    <SuiEditor
      key={key}
      mode={editorMode}
      value={fieldValue}
      style={{ ...customStyle }}
      onChange={(v) => {
        setFieldValue(v);
      }}
      toolbarConfig={
        toolbarConfigMode === 'default' || !toolbarConfig?.length
          ? undefined
          : { toolbarKeys: toolbarConfig }
      }
    />
  );
};
