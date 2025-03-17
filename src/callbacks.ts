import { type Message, MessageType, type CallbackResult, type LexerActionCallback, Option } from './types';
import set from 'set-value';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getValue = (value: any, opt: Option): string | number | string[] | number[] => {
  if (typeof value === 'string') {
    if (opt.multiValue) {
      if (opt.composeType !== undefined && /^-?\d+$/.test(value)) {
        try {
          return opt.composeType === 'int' ? [parseInt(value)] : [parseFloat(value)];
        }
        catch {
          return [value];
        }
      }
      return [value];
    }

    if (opt.composeType !== undefined && /^-?\d+$/.test(value)) {
      try {
        return opt.composeType === 'int' ? parseInt(value) : parseFloat(value);
      }
      catch {
        return value;
      }
    }
  }
  return value;
};

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
  const valueToSet = {};
  set(valueToSet, opt.path, true);
  return { path: opt.path, value: valueToSet, multiValue: opt.multiValue, additionalObject: undefined };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const processOptionWithArgs: LexerActionCallback = (opt, value: any) => {
  const val = getValue(value, opt);
  const valueToSet = {};
  set(valueToSet, opt.path, val);
  return { path: opt.path, value: valueToSet, multiValue: opt.multiValue, additionalObject: undefined };
};

export const processLoggingOption: LexerActionCallback = (opt, value) => {
  if (opt === null || value === undefined || typeof value !== 'string') {
    return null;
  }

  const str = value as string;
  const val = str.split('=');
  return processOptionWithArgs(opt, { [val[0]]: val[1] });
};

export const processStorageOption: LexerActionCallback = (opt, value) => {
  const val = value.split('=');
  return processOptionWithArgs(opt, { [val[0]]: val[1] });
};

export const processNetworkOption: LexerActionCallback = (opt, value) => {
  const result = processOptionWithArgs(opt, { [value]: {} }) as CallbackResult;

  // We have to return the networks block as additional object too
  result.additionalObject = {
    networks: { [value]: {} },
  };

  return result;
};

export const processUlimitOption: LexerActionCallback = (opt, value: string) => {
  const parts = value.match(/(?<type>[^=]+)=(?<hardLimit>[^:]+)(:(?<softLimit>\S+))?/);
  if (parts !== null) {
    if (parts.length === 5) {
      if (parts.groups !== undefined) {
        if (parts.groups.softLimit === undefined) {
          return processOptionWithArgs(opt, {
            [parts.groups.type]: parseInt(parts.groups.hardLimit),
          });
        }

        return processOptionWithArgs(opt, {
          [parts.groups.type]: {
            hard: parseInt(parts.groups.hardLimit),
            soft: parseInt(parts.groups.softLimit),
          },
        });
      }
    }
  }

  return {
    type: MessageType.errorDuringConversion,
    value: `The option "--${opt.name}${
      opt.short !== undefined ? '/-' + opt.short : ''
    }" could not be translated to docker-compose.yml. The not translatable value was "${value}"`,
  };
};
