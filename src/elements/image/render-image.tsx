import React from 'react';
import { Image } from '@sobot/soil-ui';
import { useRegisterEvents, useFormUpdate } from '@/hooks';

import { EEventAction } from '@/types';
import type { TElementRender } from '@/types';

export const RenderImage: TElementRender = ({
  element,
  fieldValue,
  customStyle,
  extendProps,
}) => {
  const { placeholder, preview, previewSrc } = element;
  const { eventFunctions } = useRegisterEvents(element);

  useFormUpdate(() => {
    eventFunctions[EEventAction.ON_LOADED]?.();
  }, [eventFunctions[EEventAction.ON_LOADED]]);

  return (
    <Image
      src={fieldValue || placeholder}
      fallback={placeholder}
      preview={preview ? (previewSrc ? { src: previewSrc } : true) : false}
      style={customStyle}
      {...extendProps}
    />
  );
};
