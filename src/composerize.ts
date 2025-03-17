import { parse } from './parser';
import { ComposerizeResult, ParseResult, SupportedOption } from './types';
import * as YAML from 'yamljs';
import { deepmerge } from 'deepmerge-ts';
import { getSupportedOptions } from './options';

const createComposeObjectStructure = (parseResult: ParseResult): object => {
  let composeSpecification: {
    services: {
      [key: string]: object;
    };
  } = {
    services: {
      [parseResult.serviceName]: {},
    },
  };

  let service = {};
  parseResult.properties.forEach(result => (service = deepmerge(result.value, service)));
  composeSpecification['services'][parseResult.serviceName] = service;

  if (parseResult.additionalComposeObjects !== undefined) {
    parseResult.additionalComposeObjects.forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (obj: any) => (composeSpecification = deepmerge(composeSpecification, obj)),
    );
  }

  return composeSpecification;
};

/**
 *
 * @param command
 * @param composeVersion
 * @param debug
 * @param includeVersion
 */
export const composerize = (
  command: string,
  composeVersion: number = 3.9,
  debug: boolean = false,
  includeVersion: boolean = false,
): ComposerizeResult => {
  const parseResult = parse(command, debug);

  /* eslint-disable no-console, no-undef */
  if (debug) {
    console.log('Parse result:');
    console.log(JSON.stringify(parseResult, null, 2));
  }
  /* eslint-enable no-console, no-undef */

  let composeSpecification = createComposeObjectStructure(parseResult);
  if (includeVersion && composeVersion) {
    composeSpecification = {
      version: (Math.floor(composeVersion * 10) / 10).toString(),
      ...composeSpecification,
    };
  }
  return new ComposerizeResult(YAML.stringify(composeSpecification, 9, 4), parseResult.messages);
};

/**
 * Function to return all the supported (=currently implemented) options with their corresponding docker-compose equivalent.
 */
export const listSupportedOptions = (): Array<SupportedOption> => {
  return getSupportedOptions();
};
