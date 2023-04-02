import Lexer from 'flex-js';

/**
 * The result of a conversion. The result contains the docker-compose.yml and
 * additional {@link Message}s.
 */
export class ComposerizeResult {
  constructor(yaml: string, messages: Array<Message>) {
    this.yaml = yaml;
    this.messages = messages;
  }
  yaml: string;
  messages: Array<Message>;
}

/**
 * A docker option which is supported by this library with it's corresponding docker-compose equivalent.
 */
export class SupportedOption {
  constructor(dockerOption: string, composeEquivalent: string, shortOption?: string) {
    this.dockerOption = dockerOption;
    this.composeEquivalent = composeEquivalent;
    if (shortOption !== undefined) {
      this.dockerOption += '/' + shortOption;
    }
  }

  dockerOption: string;
  composeEquivalent: string;
}

/**
 * The type of a returned {@link Message}.
 */
export enum MessageType {
  notImplemented = 'notImplemented',
  notTranslatable = 'notTranslatable',
  errorDuringConversion = 'errorDuringConversion',
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
