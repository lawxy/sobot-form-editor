import React from 'react';
import { Ellipsis } from '@sobot/soil-ui';
import store from '@/store';
import { parseText } from './parse-text';

export const getElementOptions = () => {
    const options = [];
    // @ts-ignore
    for (const el of store.formElementMap.values()) {
      options.push({
        label: (
          <Ellipsis tooltip={parseText(el?.elementName) || (el.id as string)}>
            {parseText(el?.elementName) || (el.id as string)}
          </Ellipsis>
        ),
        value: el.id,
        // disabled: store.selectedElement.id === el.id,
      });
    }
    return options;
};
