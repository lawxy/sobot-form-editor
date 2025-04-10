import React, { useRef } from 'react';
import {
  FormEditor,
  Material,
  Settings,
  FormCanvas,
} from '@sobot/form-editor';
// import { customElement } from '../common/customEl';
import SoilUi from '../soil-ui';

const Comp = () => {
  const ref = useRef();
  return (
    <FormEditor
      mode="design"
      ref={ref}
      // 预览url和保存回调
      actionProp={{
        previewUrl: `${process.env.PUBLIC_PATH}~demos/docs-preview-demo-demo-preview`,
        onSave(schema) {
          console.log('schema');
          console.log(schema);
        },
      }}
      customElements={SoilUi}
    >
      <Material />
      <FormCanvas />
      <Settings />
    </FormEditor>
  );
};

export default Comp;
