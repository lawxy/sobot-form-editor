import React from 'react';
import { FormEditor, FormCanvas } from '@sobot/form-editor';
// import { customElement } from '../common/customEl';
import SoilUi from '../soil-ui';
import { LOCALE } from '../common/locale';
const Comp = () => {
  return (
    <FormEditor
      mode="form"
      customElements={SoilUi}
      LOCALE={LOCALE}
    >
      <FormCanvas />
    </FormEditor>
  );
};

export default Comp;
