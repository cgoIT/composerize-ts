const ipRegex = require('ip-regex');
import cidrRegex from 'cidr-regex';
import * as ipBigint from 'ip-bigint';
//const ipBigint = require('ip-bigint');

const bits: { [x: string]: number } = {
  v4: 32,
  v6: 128,
};

const normalizeIp = (str: string): string => ipBigint.stringify(ipBigint.parse(str));

const isIP = (ip: string): number => {
  if (ipRegex.v4({ exact: true }).test(ip)) return 4;
  if (ipRegex.v6({ exact: true }).test(ip)) return 6;
  return 0;
};

const isCidr = (ip: string): number => {
  if (cidrRegex.v4({ exact: true }).test(ip)) return 4;
  if (cidrRegex.v6({ exact: true }).test(ip)) return 6;
  return 0;
};

const parse = (str: string): { start: string; prefix: string; single: boolean | undefined; version: number } => {
  const cidrVersion = isCidr(str);
  const parsed = Object.create(null);
  if (cidrVersion) {
    parsed.cidr = str;
    parsed.version = cidrVersion;
  } else {
    const version = isIP(str);
    if (version) {
      parsed.cidr = `${str}/${bits[`v${version}`]}`;
      parsed.version = version;
      parsed.single = true;
    } else {
      throw new Error(`Network is not a CIDR or IP: ${str}`);
    }
  }

  const [ip, prefix] = parsed.cidr.split('/');
  parsed.prefix = prefix;
  const { number, version } = ipBigint.parse(ip);
  const numBits = bits[`v${version}`];
  const ipBits = number.toString(2).padStart(numBits, '0');
  const prefixLen = Number(numBits - prefix);
  const startBits = ipBits.substring(0, numBits - prefixLen);
  parsed.start = BigInt(`0b${startBits}${'0'.repeat(prefixLen)}`);
  parsed.end = BigInt(`0b${startBits}${'1'.repeat(prefixLen)}`);
  return parsed;
};

export const normalize = (cidr: string): string => {
  const { start, prefix, single, version } = parse(cidr);
  if (!single) {
    // cidr
    // set network address to first address
    return `${normalizeIp(ipBigint.stringify({ number: start, version }))}/${prefix}`;
  } else {
    // single ip
    return normalizeIp(cidr);
  }
};
