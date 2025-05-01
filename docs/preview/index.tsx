import React, { useEffect, useRef } from 'react';
import { FormEditor, FormCanvas, IEditorInstance } from '@sobot/form-editor';
// import { customElement } from '../common/customEl';
import SoilUi from '../soil-ui';
import { LOCALE, useCommon } from '../common';
const Comp = () => {
  const ref = useRef<IEditorInstance>();
  useCommon(ref)
  return (
    <FormEditor
      mode="form"
      customElements={SoilUi}
      LOCALE={LOCALE}
      ref={ref}
    >
      <FormCanvas />
    </FormEditor>
  );
};

export default Comp;
