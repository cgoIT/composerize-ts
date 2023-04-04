import Lexer from 'flex-js';
import { getOption } from './options';
import { MessageType, type Option, OptionType, ParseResult } from './types';
import { isResult } from './util';
import { normalize } from './cidr';

const set = require('set-value');

const SHORT_OPT_STATE = 'short-opt';
const LONG_OPT_STATE = 'long-opt';
const WAITING_FOR_ARGUMENT_STATE = 'waiting-for-arg';
const IMAGE_FOUND_STATE = 'image-found';
const QUOTED_STRING = 'quoted';

class ParserDto extends ParseResult {
  lexer: Lexer = new Lexer();
  lastOpt: Option | undefined = undefined;

  asParseResult() {
    const parseResult = new ParseResult();
    parseResult.serviceName = this.serviceName;
    parseResult.properties = this.properties;
    parseResult.messages = this.messages;
    parseResult.additionalComposeObjects = this.additionalComposeObjects;
    return parseResult;
  }
}

const Pattern = {
  DOCKER_CMD: /docker (run|create)/,
  STRING: /[^="][^"'\s\t\r\n]+/,
  LONG_OPT_VALUE: /[a-z][a-z0-9\-]+/,
  IMAGE_NAME:
    /(?:(?=[^:\/]{1,253})(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(?:\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))*(?::[0-9]{1,5})?\/)?((?![._-])(?:[a-z0-9._-]*)(?<![._-])(?:\/(?![._-])[a-z0-9._-]*(?<![._-]))*)(?::(?![.-])[a-zA-Z0-9_.-]{1,128})?/,
  QUOTE_CHAR: /"/,
  LONG_OPT: /--/,
  SHORT_OPT: /-/,
  CHAR: /./,
  WS: /\s+/,
  WS_OR_EQUALS: /{WS}|=/,
};

const prepareInput = (input: string): string => {
  return input.replace(/'/g, '"');
};

const processOption = (parserDto: ParserDto): void => {
  const opt = getOption(parserDto.lexer.text);
  parserDto.lastOpt = opt;
  if (opt === undefined) {
    parserDto.messages.push({
      type: MessageType.errorDuringConversion,
      value: `Unknown option: ${parserDto.lexer.text}`,
    });
  } else {
    if (opt.type === OptionType.withArgs) {
      parserDto.lexer.pushState(WAITING_FOR_ARGUMENT_STATE);
    } else {
      const result = opt.action.call(this, opt, parserDto.lexer);
      if (result !== undefined) {
        if (isResult(result)) {
          parserDto.properties.push(result);
          if (result.additionalObject !== undefined) {
            parserDto.additionalComposeObjects.push(result.additionalObject);
          }
        } else {
          parserDto.messages.push(result);
        }
      }
    }
  }
};

const processArgument = (value: any, parserDto: ParserDto): void => {
  if (parserDto.lastOpt === undefined) {
    parserDto.messages.push({
      type: MessageType.errorDuringConversion,
      value: `Error while parsing. Got option value '${value}' 'but no option the value belongs to.`,
    });
    return;
  }
  const result = parserDto.lastOpt.action.call(this, parserDto.lastOpt, value, parserDto.lexer);
  if (result !== undefined) {
    if (isResult(result)) {
      parserDto.properties.push(result);
      if (result.additionalObject !== undefined) {
        parserDto.additionalComposeObjects.push(result.additionalObject);
      }
    } else {
      parserDto.messages.push(result);
    }
  }
};

const prepareLexer = (debug: boolean): ParserDto => {
  const parserDto = new ParserDto();
  const lexer = parserDto.lexer;
  const properties = parserDto.properties;

  // options
  lexer.setIgnoreCase(false);
  lexer.setDebugEnabled(debug);

  // states
  lexer.addState(QUOTED_STRING, true);
  lexer.addState(SHORT_OPT_STATE, true);
  lexer.addState(LONG_OPT_STATE, true);
  lexer.addState(WAITING_FOR_ARGUMENT_STATE, true);
  lexer.addState(IMAGE_FOUND_STATE, true);

  // definitions
  for (const [name, regexp] of Object.entries(Pattern)) {
    lexer.addDefinition(name, regexp);
  }

  // rules
  // Commands always begin with "docker run" or "docker create"
  lexer.addRule(Pattern.DOCKER_CMD);

  // ignore Whitespaces
  lexer.addRule(Pattern.WS);

  // Recognize short options
  lexer.addRule(Pattern.SHORT_OPT, (lexer: Lexer) => lexer.begin(SHORT_OPT_STATE));

  // Recognize long options
  lexer.addRule(Pattern.LONG_OPT, (lexer: Lexer) => lexer.begin(LONG_OPT_STATE));

  // Handle quoted strings
  let str = '';
  lexer.addStateRule(WAITING_FOR_ARGUMENT_STATE, Pattern.QUOTE_CHAR, (lexer) => lexer.pushState(QUOTED_STRING));
  lexer.addStateRule(QUOTED_STRING, Pattern.QUOTE_CHAR, function (lexer) {
    lexer.popState();
    const token = str;
    str = '';
    if (lexer.state == WAITING_FOR_ARGUMENT_STATE) {
      processArgument(token, parserDto);
      lexer.begin(Lexer.STATE_INITIAL);
    }
  });
  lexer.addStateRule(QUOTED_STRING, /[^\n\"]+/, function (lexer) {
    str += lexer.text;
  });

  // Rules to process short options
  lexer.addStateRule(SHORT_OPT_STATE, Pattern.WS, (lexer) => lexer.begin(Lexer.STATE_INITIAL));
  lexer.addStateRule(SHORT_OPT_STATE, Pattern.CHAR, () => processOption(parserDto));

  // Rules to process long options
  lexer.addStateRule(LONG_OPT_STATE, Pattern.LONG_OPT_VALUE, () => processOption(parserDto));
  lexer.addStateRule(LONG_OPT_STATE, Pattern.WS, (lexer) => lexer.begin(Lexer.STATE_INITIAL));

  // Process the arguments for an option
  lexer.addStateRule(WAITING_FOR_ARGUMENT_STATE, Pattern.WS_OR_EQUALS);
  lexer.addStateRule(WAITING_FOR_ARGUMENT_STATE, Pattern.STRING, (lexer) => {
    processArgument(lexer.text.trim(), parserDto);
    lexer.begin(Lexer.STATE_INITIAL);
  });
  lexer.addStateRule(WAITING_FOR_ARGUMENT_STATE, Pattern.CHAR, () => {
    parserDto.messages.push({
      type: MessageType.errorDuringConversion,
      // @ts-ignore
      value: `The option "--${parserDto.lastOpt.name}${
        // @ts-ignore
        parserDto.lastOpt.short !== undefined ? '/-' + parserDto.lastOpt.short : ''
      }"`,
    });
  });

  // Recognize image
  lexer.addStateRule(Lexer.STATE_INITIAL, Pattern.IMAGE_NAME, (lexer) => {
    lexer.begin(IMAGE_FOUND_STATE);
    const imageName = lexer.text;
    parserDto.serviceName = getServiceName(imageName);
    properties.push({
      path: 'image',
      value: set({}, 'image', imageName),
      multiValue: false,
      additionalObject: undefined,
    });
  });

  // Get docker command
  lexer.addStateRule(IMAGE_FOUND_STATE, / .*/, (lexer) => {
    properties.push({
      path: 'command',
      value: set({}, 'command', lexer.text.trim()),
      multiValue: false,
      additionalObject: undefined,
    });
    lexer.terminate();
  });

  return parserDto;
};
const tokenize = (lexer: Lexer, input: string): void => {
  lexer.setSource(input);
  lexer.lexAll();
};

const postProcessNetworkOption = (dto: ParserDto): void => {
  const network = dto.properties.find((result) => result.path === 'networks');
  let networkName = 'default';
  if (network !== undefined) {
    // @ts-ignore
    networkName = Object.keys(network.value['networks'])[0];
    // custom network name present
    const networkRelatedProperties = dto.properties.filter(
      (result) => result.path.startsWith('networks') && result.path !== 'networks'
    );
    networkRelatedProperties.forEach((result) => {
      // @ts-ignore
      const obj = result.value['networks'];
      // @ts-ignore
      Object.defineProperty(obj, networkName, Object.getOwnPropertyDescriptor(obj, 'default'));
      delete obj['default'];
    });
  }

  const specificIpAddresses: string[] = [];
  const networkRelatedProperties = dto.properties.filter(
    (result) => result.path.startsWith('networks') && result.path !== 'networks'
  );
  networkRelatedProperties.forEach((result) => {
    if (result.path.includes('ipv4_address')) {
      // @ts-ignore
      specificIpAddresses.push(result.value.networks[networkName].ipv4_address + '/24');
    }
    if (result.path.includes('ipv6_address')) {
      // @ts-ignore
      specificIpAddresses.push(result.value.networks[networkName].ipv6_address + '/64');
    }
  });
  if (specificIpAddresses.length > 0) {
    const additionalNetworkConfig = {
      networks: {
        [networkName]: {
          driver: 'default',
          config: [],
        },
      },
    };
    specificIpAddresses.forEach((address) => {
      // @ts-ignore
      additionalNetworkConfig.networks[networkName].config.push({ subnet: getCidr(address) });
    });
    dto.additionalComposeObjects.push(additionalNetworkConfig);
  }
};

const getCidr = (ip: string): string => {
  return normalize(`${ip}`);
};

const getServiceName = (image: string): string => {
  let name = image.includes('/') ? image.split('/')[1] : image;
  name = name.includes(':') ? name.split(':')[0] : name;

  return name;
};

export const parse = (command: string, debug: boolean): ParseResult => {
  const preparedInput = prepareInput(command);
  const parserDto = prepareLexer(debug);
  tokenize(parserDto.lexer, preparedInput);
  postProcessNetworkOption(parserDto);

  return parserDto.asParseResult();
};
