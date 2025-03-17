import { Message, CallbackResult } from './types';

// eslint-disable-next-line no-prototype-builtins
export const isResult = (obj: CallbackResult | Message): obj is CallbackResult => obj.hasOwnProperty('path');
