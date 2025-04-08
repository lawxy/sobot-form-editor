import React from 'react';
import { FormEditor, FormCanvas } from '@sobot/form-editor';
// import { customElement } from '../common/customEl';
import SoilUi from '../soil-ui';
const Comp = () => {
  return (
    <FormEditor
      mode="form"
      customElements={SoilUi}
    >
      <FormCanvas />
    </FormEditor>
  );
};

export default Comp;
