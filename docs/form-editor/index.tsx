import React, { useRef, useEffect } from 'react';
import {
  FormEditor,
  Material,
  Settings,
  FormCanvas,
  IEditorInstance,
  SideBar,
} from '@sobot/form-editor';
// import { customElement } from '../common/customEl';
import SoilUi from '../soil-ui';
import { LOCALE } from '../common/locale';

const Comp = () => {
  const ref = useRef<IEditorInstance>();
  useEffect(() => {
    // ref.current?.getElement('fe-input-39dralgtkg').then(el => {
    //   console.log('el', el);
    // })
    ref.current?.setFieldValue('bbbb', 'inputadsf123123');
    // console.log('ref.current', ref.current);
    setTimeout(() => {
      ref.current.setElementProp({ fieldName: 'bbbb' }, 'isFormItem', true);
      ref.current.extendFormItemAttrs(
        { fieldName: 'bbbb' },
        {
          // presets: ['TODAY'],
          // placeholder: '123123123',
          label: '测试',
        },
      );
    }, 0);
  }, []);
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
      <SideBar />
      <FormCanvas />
      <Settings />
    </FormEditor>
  );
};

export default Comp;
