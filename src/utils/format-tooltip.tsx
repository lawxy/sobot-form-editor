import React from 'react';
import { Tooltip } from '@sobot/soil-ui';
import { isUndefined } from 'lodash-es';
import { TextWithLang } from "@/types";

export const formatTooltip = (tooltip?: TextWithLang | any) => {
  if (isUndefined(tooltip)) {
    return null;
  }
  const isLangText = Object.keys(tooltip).includes('langText');
  if(isLangText) {
    if(tooltip.langText) {
      return <Tooltip.Info title={tooltip.langText} />;
    }
    return null;
  }
  return tooltip;
};
