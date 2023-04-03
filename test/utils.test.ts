import { expect, test } from 'vitest';
import { normalize } from '../src/cidr';

test('get ipv4 cidr for ipv4 address', async () => {
  const ip = '192.168.0.22/24';
  const result = normalize(ip);
  expect(result).toEqual('192.168.0.0/24');
});

test('get ipv6 cidr for ipv6 address', async () => {
  const ip = '12:a::1:2:3:1/64';
  const result = normalize(ip);
  expect(result).toEqual('12:a::/64');
});
