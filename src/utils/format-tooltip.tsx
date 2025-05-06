import React from 'react';
import { Tooltip } from '@sobot/soil-ui';
import { isUndefined } from 'lodash-es';
import { TextWithLang } from "@/types";
import { parseText } from './parse-text';

export const formatTooltip = (tooltip?: TextWithLang | any) => {
  if (isUndefined(tooltip)) {
    return null;
  }
  if(parseText(tooltip)) {
    return <Tooltip.Info title={parseText(tooltip)} />;
  }
  return tooltip;
  // const isLangText = Object.keys(tooltip).includes('langText');
  // if(isLangText) {
  //   if(tooltip.langText) {
  //     return <Tooltip.Info title={tooltip.langText} />;
  //   }
  //   return null;
  // }
  // return tooltip;
};
