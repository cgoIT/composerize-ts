#!/usr/bin/env node
/* eslint-disable */

const composerize = require('./lib/cjs/index');

const command = process.argv.slice(2).join(' ');
const result = composerize.composerize(command);
console.log('docker-compose.yml:');
console.log(result.yaml);

console.log('Messages:');
result.messages.forEach((message) => console.log(message));
