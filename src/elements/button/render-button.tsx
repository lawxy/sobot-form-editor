import React from 'react';
import { Button } from '@sobot/soil-ui';
import { useRegisterEvents } from '@/hooks';

import { EEventAction, TElementRender } from '@/types';

export const RenderButton: TElementRender = ({ element, customStyle }) => {
  const { eventFunctions } = useRegisterEvents(element);
  const { btnText, linkLoading } = element;

  return (
    <Button
      onClick={() => {
        eventFunctions[EEventAction.ON_CLICK]?.();
      }}
      loading={linkLoading}
      style={customStyle}
    >
      {btnText}
    </Button>
  );
};
