import React from 'react';
import { Button } from '@sobot/soil-ui';
import { useRegisterEvents } from '@/hooks';

import { EEventAction, TElementRender } from '@/types';

export const RenderButton: TElementRender = ({
  element,
  customStyle,
  extendProps,
}) => {
  const { eventFunctions } = useRegisterEvents(element);
  const { btnText, linkLoading, btnType, size } = element;

  return (
    <Button
      onClick={() => {
        eventFunctions[EEventAction.ON_CLICK]?.();
      }}
      loading={linkLoading}
      style={customStyle}
      type={btnType as any}
      size={size as any}
      {...extendProps}
    >
      {btnText?.langText}
    </Button>
  );
};
