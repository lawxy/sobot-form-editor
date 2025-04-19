import React from 'react';

import type { TElementRender } from '@/types';

export const RenderText: TElementRender = ({
  element,
  customStyle,
  extendProps,
}) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: element?.elementName?.langText || '' }}
      style={customStyle}
      {...extendProps}
    />
  );
};
