import Lexer from 'flex-js';

/**
 * The result of a conversion. The result contains the docker-compose.yml and
 * additional {@link Message}s.
 */
export interface ComposerizeResult {
  yaml: string;
  messages: Array<Message>;
}

/**
 * The type of a returned {@link Message}.
 */
export enum MessageType {
  notImplemented = 'notImplemented',
  notTranslatable = 'notTranslatable',
}

/**
 * A message which could be returned.
 */
export interface Message {
  type: MessageType;
  value: string;
}

/**
 * @internal
 */
export class ParseResult {
  serviceName: string = '';
  properties: Array<CallbackResult> = [];
  messages: Array<Message> = [];
  additionalComposeObjects: Array<object> = [];
}

/**
 * @internal
 */
export type LexerActionCallback = (option: Option, value?: any, lexer?: Lexer) => CallbackResult | Message | undefined;

/**
 * @internal
 */
export interface CallbackResult {
  path: string;
  value: string | number | boolean | Array<any>;
  multiValue: boolean;
  additionalObject: object | undefined;
}

/**
 * @internal
 */
export enum OptionType {
  flag,
  withArgs,
}

/**
 * @internal
 */
export interface Options {
  [name: string]: Option;
}

/**
 * @internal
 */
export interface Option {
  name: string;
  short?: string;
  path: string;
  type: OptionType;
  multiValue: boolean;
  action: LexerActionCallback;
}

/**
 * @internal
 */
export interface Patterns {
  [name: string]: RegExp;
}
