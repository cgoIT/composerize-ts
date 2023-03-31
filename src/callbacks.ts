import { type Message, MessageType, type CallbackResult, type LexerActionCallback } from './types';

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
  return { path: opt.path, value: true, multiValue: opt.multiValue, additionalObject: undefined };
};

export const processOptionWithArgs: LexerActionCallback = (opt, value) => {
  const val = opt.multiValue ? [value] : value;
  return { path: opt.path, value: val, multiValue: opt.multiValue, additionalObject: undefined };
};

export const processNetworkOption: LexerActionCallback = (opt, value) => {
  const result = processOptionWithArgs(opt, value) as CallbackResult;

  // We have to return the networks block as additional object too
  result.additionalObject = {
    networks: [value],
  };

  return result;
};
