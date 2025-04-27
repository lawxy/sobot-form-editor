import React from 'react';
import { Ellipsis } from '@sobot/soil-ui';
import store from '@/store';

export const getElementOptions = () => {
    const options = [];
    // @ts-ignore
    for (const el of store.formElementMap.values()) {
      options.push({
        label: (
          <Ellipsis tooltip={el?.elementName?.langText || (el.id as string)}>
            {el?.elementName?.langText || (el.id as string)}
          </Ellipsis>
        ),
        value: el.id,
        // disabled: store.selectedElement.id === el.id,
      });
    }
    return options;
};
