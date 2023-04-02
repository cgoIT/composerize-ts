import { type Message, MessageType, type CallbackResult, type LexerActionCallback } from './types';
const set = require('set-value');

export const notYetImplemented: LexerActionCallback = (opt): Message => {
  return {
    type: MessageType.notImplemented,
    value: `The option "--${opt.name}${opt.short !== undefined ? '/-' + opt.short : ''}" is not yet implemented.`,
  };
};

export const notImplementedInCompose: LexerActionCallback = (opt): Message => {
  return {
    type: MessageType.notTranslatable,
    value: `The option "--${opt.name}${
      opt.short !== undefined ? '/-' + opt.short : ''
    }" could not be translated to docker-compose.yml.`,
  };
};

export const processBoolean: LexerActionCallback = (opt): CallbackResult => {
  return { path: opt.path, value: set({}, opt.path, true), multiValue: opt.multiValue, additionalObject: undefined };
};

export const processOptionWithArgs: LexerActionCallback = (opt, value) => {
  const val = opt.multiValue ? [value] : value;
  return { path: opt.path, value: set({}, opt.path, val), multiValue: opt.multiValue, additionalObject: undefined };
};

export const processLoggingOption: LexerActionCallback = (opt, value) => {
  const val = value.split('=');
  return processOptionWithArgs(opt, { [val[0]]: val[1] });
};

export const processNetworkOption: LexerActionCallback = (opt, value) => {
  const result = processOptionWithArgs(opt, value) as CallbackResult;

  // We have to return the networks block as additional object too
  result.additionalObject = {
    networks: [value],
  };

  return result;
};

export const processUlimitOption: LexerActionCallback = (opt, value) => {
  const parts = value.match(/(?<type>[^=]+)=(?<hardLimit>[^:]+)(:(?<softLimit>\S+))?/);
  if (parts !== null) {
    if (parts.length === 5) {
      if (parts.groups.softLimit === undefined) {
        return processOptionWithArgs(opt, {
          [parts.groups.type]: parts.groups.hardLimit,
        });
      }

      return processOptionWithArgs(opt, {
        [parts.groups.type]: {
          hard: parts.groups.hardLimit,
          soft: parts.groups.softLimit,
        },
      });
    }
  }

  return {
    type: MessageType.errorDuringConversion,
    value: `The option "--${opt.name}${
      opt.short !== undefined ? '/-' + opt.short : ''
    }" could not be translated to docker-compose.yml. The not translatable value was "${value}"`,
  };
};
