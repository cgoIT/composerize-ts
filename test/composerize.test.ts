import { expect, test } from 'vitest';
import { composerize } from '../src';
import * as YAML from 'yamljs';
import * as path from 'path';
import { MessageType } from '../src/types';

test('parses simple docker run command', async () => {
  const cmd = 'docker run --volume /var/dir1:/var/nginx/dir1 -v /var/dir2:/var/nginx/dir2 nginx:latest';
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

test('can publish ports', async () => {
  const cmd = 'docker run -p 80:80 --publish 127.0.0.1:8443:443/udp nginx:latest';
  const result = composerize(cmd);
  const expected = YAML.load(path.join(__dirname, './data/ports.yaml'));
  expect(result.yaml).toEqual(YAML.stringify(expected, 9, 4));
});

test('test a complex command', async () => {
  const cmd = `docker run -p 80:80 --tty --init --security-opt seccomp:unconfined --mac-address 02:42:ac:11:65:43 --ulimit nofile=1024:1024  --network network  -h containerhostname --name nginxc --cap-drop NET_ADMIN  --cap-drop SYS_ADMIN --cap-add ALL  --tmpfs /run --privileged --restart on-failure --device /dev/sdc:/dev/xvdc -l my-label --label com.example.foo=bar -e MYVAR1 --env MYVAR2=foo --env-file ./env.list --add-host somehost:162.242.195.82 --dns 10.0.0.10  --dns=1.1.1.1 -v /var/run/docker.sock:/tmp/docker.sock -v .:/opt --restart always --log-opt max-size=1g nginx`;
  const result = composerize(cmd);
  const expected = YAML.load(path.join(__dirname, './data/complex.yaml'));
  expect(result.yaml).toEqual(YAML.stringify(expected, 9, 4));

  const ulimit = result.messages.find(
    (msg) => msg.type === MessageType.notImplemented && msg.value.includes('--ulimit')
  );
  expect(ulimit).toBeDefined();

  const logOpt = result.messages.find(
    (msg) => msg.type === MessageType.notImplemented && msg.value.includes('--log-opt')
  );
  expect(logOpt).toBeDefined();
});
