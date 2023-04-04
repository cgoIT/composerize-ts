#!/usr/bin/env node

const { Command, InvalidArgumentError } = require('commander');
const program = new Command();

const pjson = require('./package.json');

const composerize = require('./dist/cjs/index');

const parseFloatInternal = (value, dummyPrevious) => {
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a valid version number');
  }
  return Math.floor(parsedValue * 10) / 10;
};

program
  .name('composerize-ts')
  .version(pjson.version)
  .argument('<docker-command>', 'The docker command to convert ("docker run" or "docker create")')
  .argument('[args...]', 'The options of the docker run/create command', [])
  .passThroughOptions()
  .option('-c, --compose-version <version>', 'The compose specification version to use', parseFloatInternal, 3.9)
  .option(
    '-q, --quiet',
    'Only write the docker-compose file to System.out. Useful for piping the result directly to a file.'
  )
  .option('-d, --debug', 'Display some debugging to System.out.');

program.parse();
const opts = program.opts();
const command = program.args.join(' ');

const result = composerize.composerize(command, opts.composeVersion, opts.debug);
if (!opts.quiet) {
  console.log('docker-compose.yml:');
}
console.log(result.yaml);

if (!opts.quiet) {
  console.log('Messages:');
  result.messages.forEach((message) => console.log(message));
}
