import { parse } from './parser';
import { ComposerizeResult, ParseResult } from './types';
import * as YAML from 'yamljs';
import { deepmerge } from 'deepmerge-ts';

const createComposeObjectStructure = (
  parseResult: ParseResult,
  composeVersion: number
): object => {
  const composeSpecification = {
    version: (Math.floor(composeVersion * 10) / 10).toString(),
    services: {
      [parseResult.serviceName]: {},
    },
  };

  let service = composeSpecification.services[parseResult.serviceName];
  parseResult.properties.forEach(
    (result) => (service = deepmerge({ [result.path]: result.value }, service))
  );
  composeSpecification['services'][parseResult.serviceName] = service;

  return composeSpecification;
};

/**
 *
 * @param command
 * @param composeVersion
 * @param debug
 */
export const composerize = (
  command: string,
  composeVersion: number = 3.9,
  debug: boolean = false
): ComposerizeResult => {
  const parseResult = parse(command, debug);

  if (debug) {
    console.log('Parse result:');
    console.log(JSON.stringify(parseResult, null, 2));
  }

  const composeSpecification = createComposeObjectStructure(
    parseResult,
    composeVersion
  );
  return {
    yaml: YAML.stringify(composeSpecification, 9, 4),
    messages: parseResult.messages,
  };
};
