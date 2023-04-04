import { expect, test } from 'vitest';
import { normalize } from '../src/cidr';

test('get ipv4 cidr for ipv4 address', async () => {
  const ip = '192.168.0.22/24';
  const result = normalize(ip);
  expect(result).toEqual('192.168.0.0/24');
});

test('get ipv6 cidr for ipv6 address', async () => {
  const ip = '2001:0000:0000:1234:1b12:0000:0000:1a13/64';
  const result = normalize(ip);
  expect(result).toEqual('2001:0:0:1234::/64');
});
