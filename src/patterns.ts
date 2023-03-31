import { Patterns } from './types';

export const Pattern: Patterns = {
  DOCKER_CMD: /docker (run|create)/,
  STRING: /[^"'\s\t\r\n]+/,
  IMAGE_NAME: /[^-\s]+/,
  QUOTE_CHAR: /["']/,
  LONG_OPT: /--/,
  SHORT_OPT: /-/,
  CHAR: /./,
  WS: /\s+/,
};
