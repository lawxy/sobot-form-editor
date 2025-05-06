import { interpolate } from '@sobot/utils/i18n';

import type { TextWithLang } from '@/types';

export const parseText = (text?: TextWithLang | string) => {
    if(!text || typeof text === 'string') return text;
    // return text?.langText
    return interpolate(text?.langText, text?.params)
}