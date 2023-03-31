import Lexer from 'flex-js';
import { getOption } from './options';
import { Pattern } from './patterns';
import { type Message, type CallbackResult, type Option, OptionType, type ParseResult } from './types';
import { isMessage } from './util';

const SHORT_OPT_STATE = 'short-opt';
const LONG_OPT_STATE = 'long-opt';
const WAITING_FOR_ARGUMENT_STATE = 'waiting-for-arg';
const IMAGE_FOUND_STATE = 'image-found';
const QUOTED_STRING = 'quoted';

let lastOpt: Option | undefined = undefined;

let serviceName = '';
let messages: Array<Message> = [];
let properties: Array<CallbackResult> = [];

const prepareInput = (input: string): string => {
  return input.replace(/'/g, '"');
};

const processOption = (lexer: Lexer): void => {
  const opt = getOption(lexer.text);
  lastOpt = opt;
  if (opt === undefined) {
    throw new Error('Undefined option: ' + lexer.text);
  } else {
    if (opt.type === OptionType.withArgs) {
      lexer.pushState(WAITING_FOR_ARGUMENT_STATE);
      //lexer.more();
    } else {
      const result = opt.action.call(this, opt, lexer);
      if (result !== undefined) {
        isMessage(result) ? messages.push(result) : properties.push(result);
      }
    }
  }
};

const processArgument = (value: any, lexer?: Lexer): void => {
  if (lastOpt === undefined) {
    throw new Error('Error while parsing. Got argument value but no option the value belongs to.');
  }
  const result = lastOpt.action.call(this, lastOpt, value, lexer);
  if (result !== undefined) {
    isMessage(result) ? messages.push(result) : properties.push(result);
  }
};

const prepareLexer = (debug: boolean): Lexer => {
  const lexer = new Lexer();

  // options
  lexer.setIgnoreCase(false);
  lexer.setDebugEnabled(debug);

  // states
  lexer.addState(QUOTED_STRING);
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
  lexer.addRule(Pattern.DOCKER_CMD, (lexer) => lexer.discard());

  // Whitespace handling
  lexer.addRule(Pattern.WS, () => {
    lexer.begin(Lexer.STATE_INITIAL);
    return '';
  });

  // Recognize short options
  lexer.addRule(Pattern.SHORT_OPT, (lexer: Lexer) => lexer.begin(SHORT_OPT_STATE));

  // Recognize long options
  lexer.addRule(Pattern.LONG_OPT, (lexer: Lexer) => lexer.begin(LONG_OPT_STATE));

  // Handle quoted strings
  let str = '';
  lexer.addStateRule([Lexer.STATE_INITIAL, SHORT_OPT_STATE, LONG_OPT_STATE], /"/, (lexer) =>
    lexer.pushState(QUOTED_STRING)
  );
  lexer.addStateRules(QUOTED_STRING, [
    {
      expression: /"/,
      action: (lexer) => {
        lexer.popState();
        const token = str;
        str = '';
        //console.log('Quoted string value: ' + token);
        return token;
      },
    },
    { expression: Pattern.STRING, action: (lexer) => (str += lexer.text) },
  ]);

  // Rules to process short options
  lexer.addStateRules(SHORT_OPT_STATE, [
    {
      expression: /{WS}/,
      action: (lexer: Lexer) => lexer.begin(Lexer.STATE_INITIAL),
    },
    { expression: /{CHAR}/, action: (lexer: Lexer) => processOption(lexer) },
  ]);

  // Rules to process long options
  lexer.addStateRules(LONG_OPT_STATE, [
    { expression: /{STRING}/, action: (lexer: Lexer) => processOption(lexer) },
    {
      expression: /{WS}/,
      action: (lexer: Lexer) => lexer.begin(Lexer.STATE_INITIAL),
    },
  ]);
  lexer.addStateRules(WAITING_FOR_ARGUMENT_STATE, [
    {
      expression: Pattern.CHAR,
      action: () => {
        // @ts-ignore
        throw new Error(
          'The option ' +
            // @ts-ignore
            `"--${lastOpt.name}${
              // @ts-ignore
              lastOpt.short !== undefined ? '/-' + lastOpt.short : ''
            }" ` +
            'needs a parameter'
        );
      },
    },
    {
      expression: /\s+{STRING}/,
      action: (lexer) => {
        processArgument(lexer.text.trim());
        lexer.begin(Lexer.STATE_INITIAL);
      },
    },
  ]);

  // Recognize image
  lexer.addStateRule(Lexer.STATE_INITIAL, Pattern.IMAGE_NAME, (lexer) => {
    lexer.begin(IMAGE_FOUND_STATE);
    const imageName = lexer.text;
    serviceName = getServiceName(imageName);
    properties.push({ path: 'image', value: imageName, multiValue: false });
  });

  // Get docker command
  lexer.addStateRule(IMAGE_FOUND_STATE, / .*/, (lexer) => {
    properties.push({
      path: 'command',
      value: lexer.text.trim(),
      multiValue: false,
    });
    lexer.terminate();
  });

  return lexer;
};
const tokenize = (lexer: Lexer, input: string): void => {
  lexer.setSource(input);
  lexer.lexAll();
};

const getServiceName = (image: string): string => {
  let name = image.includes('/') ? image.split('/')[1] : image;
  name = name.includes(':') ? name.split(':')[0] : name;

  return name;
};

export const parse = (command: string, debug: boolean): ParseResult => {
  serviceName = '';
  properties = [];
  messages = [];

  const preparedInput = prepareInput(command);
  const lexer = prepareLexer(debug);
  tokenize(lexer, preparedInput);

  return {
    serviceName: serviceName,
    properties: properties,
    messages: messages,
  };
};
