import { expect, test } from 'vitest';
import { composerize } from '../src';
import * as YAML from 'yamljs';
import * as path from 'path';
import { MessageType } from '../src/types';

test('parses simple docker run command', async () => {
  const cmd =
    'docker run   --volume=/var/dir1:/var/nginx/dir1 -v                  /var/dir2:/var/nginx/dir2 nginx:latest';
  const result = composerize(cmd);
  const expected = YAML.load(path.join(__dirname, './data/basic.yaml'));
  expect(result.yaml).toEqual(YAML.stringify(expected, 9, 4));
});

test('parses simple docker run command with multiple whitespaces and equals sign between option name and value', async () => {
  const cmd =
    'docker run   --volume="/var/dir1:/var/nginx/dir1" -v                  /var/dir2:/var/nginx/dir2 nginx:latest';
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
  const cmd = `docker run -p 80:80 --tty --init --cpu-period 1400us --security-opt seccomp:unconfined --mac-address 02:42:ac:11:65:43 --ulimit nofile=1024:1024  --network network  -h containerhostname --name nginxc --cap-drop NET_ADMIN  --cap-drop SYS_ADMIN --cap-add ALL  --tmpfs /run --privileged --restart on-failure --device /dev/sdc:/dev/xvdc -l my-label --label com.example.foo=bar -e MYVAR1 --env MYVAR2=foo --env-file ./env.list --add-host somehost:162.242.195.82 --dns 10.0.0.10  --dns=1.1.1.1 -v /var/run/docker.sock:/tmp/docker.sock -v .:/opt --restart always --log-driver json-file --blkio-weight 400 --log-opt max-size=1g nginx`;
  const result = composerize(cmd);
  const expected = YAML.load(path.join(__dirname, './data/complex.yaml'));
  expect(result.yaml).toEqual(YAML.stringify(expected, 9, 4));
  expect(result.messages.length).toEqual(0);
});

test('test an even more complex command', async () => {
  const cmd = `docker run --add-host addedhost1 --blkio-weight 400 --cap-add NET_ADMIN --cap-add SYS_ADMIN --cap-drop ALL 
  --cgroupns private --cgroup-parent parent-cgroup --cpu-count 2 --cpu-percent 22 
  --cpu-period 33 --cpu-quota 44 --cpu-rt-period 35 --cpu-rt-runtime 45 
  --cpus 2 --cpuset-cpus 0-3 --device /dev/ttyUSB0:/dev/ttyUSB0 --device /dev/sda:/dev/xvda:rwm --device-cgroup-rule "c 1:3 mr" --device-cgroup-rule "a 7:* rmw" --dns 8.8.8.8 --dns 9.9.9.9 
  --dns-option use-vc --dns-option no-tld-query --dns-search dc1.example.com --dns-search dc2.example.com --domainname example.com --entrypoint /docker-entrypoint.sh --env ENV1 --env ENV2=false 
  --env-file env.list --expose 3000 --expose 8000 --group-add wheel --health-cmd "test -z ENV1 && echo true" --health-interval 30s 
  --health-retries 3 --health-start-period 1m30s --health-timeout 10s 
  --hostname containerhostname --init --interactive --ipc shareable --isolation isolation_technology 
  --label mylabel=value1 --label mylabel2=value2 --link other_container --log-driver json-file --log-opt max-size=1g --mac-address aa:bb:cc:dd:ee 
  --memory-swappiness 0 --name mycontainername --network my_net --network-alias mynwalias --network-alias myothernwalias --ip 192.168.100.56 --ip6 a:b:c:d:e::22 --oom-kill-disable
  --oom-score-adj -200 --pid host --pids-limit 40 --platform linux/arm64/v8 --privileged 
  --publish 80:80 --publish 443:443 --pull always --read-only --restart on-failure --runtime runc 
  --security-opt label:user:USER --security-opt label:role:ROLE --shm-size 512m --stop-signal SIGUSR1 --stop-timeout 1m
  --storage-opt size=1G --tmpfs /run --tty --sysctl net.core.somaxconn=1024 --sysctl net.ipv4.tcp_syncookies=0 --ulimit nofile=2048:1024 --user 99 
  --userns host --volumes-from other_service --volume /var/dir1:/var/container1:ro --workdir /tmp nginx bash -c "echo hello"`;
  const result = composerize(cmd);
  const expected = YAML.load(path.join(__dirname, './data/even-more-complex.yaml'));
  expect(result.yaml).toEqual(YAML.stringify(expected, 9, 4));
  expect(result.messages.length).toEqual(0);
});
