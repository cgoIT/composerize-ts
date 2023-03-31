import { Message, CallbackResult } from './types';

export const isMessage = (obj: CallbackResult | Message): obj is Message =>
  obj.hasOwnProperty('type');
