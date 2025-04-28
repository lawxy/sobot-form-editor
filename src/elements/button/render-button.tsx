import React from 'react';
import { Button } from '@sobot/soil-ui';
import { useGetEventFunctions } from '@/hooks';

import { EEventAction, TElementRender } from '@/types';

export const RenderButton: TElementRender = ({
  element,
  customStyle,
  extendProps,
}) => {
  const { eventFunctions } = useGetEventFunctions(element);
  const { text, linkLoading, btnType, size } = element;

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
      {text?.langText}
    </Button>
  );
};
