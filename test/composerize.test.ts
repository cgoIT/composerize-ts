import { expect, test } from 'vitest';
import { composerize } from '../src';
import * as YAML from 'yamljs';
import * as path from 'path';
import { MessageType } from '../src/types';

test('parses simple docker run command', async () => {
  const cmd = 'docker run -v /var/dir1:/var/nginx/dir1 -v /var/dir2:/var/nginx/dir2 nginx:latest';
  const result = composerize(cmd);
  const expected = YAML.load(path.join(__dirname, './data/basic.yaml'));
  expect(result.yaml).toEqual(YAML.stringify(expected, 9, 4));
});

test('parses simple docker run command with ignored options', async () => {
  const cmd = 'docker run --rm -v /var/dir1:/var/nginx/dir1 -v /var/dir2:/var/nginx/dir2 nginx:latest';
  const result = composerize(cmd);

  const expected = YAML.load(path.join(__dirname, './data/basic.yaml'));
  expect(result.yaml).toEqual(YAML.stringify(expected, 9, 4));

  const message = result.messages.find((msg) => msg.type === MessageType.notTranslatable && msg.value.includes('--rm'));
  expect(message).toBeDefined();
});

test('parses simple docker run command with custom command', async () => {
  const cmd = 'docker run -v /var/dir1:/var/nginx/dir1 -v /var/dir2:/var/nginx/dir2 nginx:latest nginx -t';
  const result = composerize(cmd);
  const expected = YAML.load(path.join(__dirname, './data/custom-command.yaml'));
  expect(result.yaml).toEqual(YAML.stringify(expected, 9, 4));
});
