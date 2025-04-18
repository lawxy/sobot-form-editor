import React, { useRef, useEffect } from 'react';
import {
  FormEditor,
  Material,
  Settings,
  FormCanvas,
} from '@sobot/form-editor';
// import { customElement } from '../common/customEl';
import SoilUi from '../soil-ui';
import { LOCALE } from '../common/locale';

const Comp = () => {
  const ref = useRef();
  useEffect(() => {
    console.log('outer')
    ref.current.extendElement('fe-input-3eti8nq8f0c', {
      placeholder: 'hhhhh'
    })
  }, [])
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
      LOCALE={LOCALE}
    >
      <Material />
      <FormCanvas />
      <Settings />
    </FormEditor>
  );
};

export default Comp;
