import { Message, CallbackResult } from './types';

export const isResult = (obj: CallbackResult | Message): obj is CallbackResult => obj.hasOwnProperty('path');
