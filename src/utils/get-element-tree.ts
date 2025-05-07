import store from '@/store';
import { IBaseElement } from '@/types';
import { parseText } from './parse-text';

const loop = (data: IBaseElement[]): any => {
    return data.map((item: IBaseElement) => {
        return {
            key: item.id,
            title: parseText(item.elementName),
            value: item.id,
            children: loop(item?.children || []),
        };
    });
};

export const getElementTree = () => {
    return loop(store.formElements);
};
