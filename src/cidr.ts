import IPCIDR from 'ip-cidr';
//const IPCIDR = require('ip-cidr');

const abbreviate = (a: string): string => {
  a = a.replace(/0000/g, 'g');
  a = a.replace(/\:000/g, ':');
  a = a.replace(/\:00/g, ':');
  a = a.replace(/\:0/g, ':');
  a = a.replace(/g/g, '0');
  a = a.replace(/^0*/, '');
  const sections = a.split(/\:/g);
  let zPreviousFlag = false;
  let zeroStartIndex = -1;
  let zeroLength = 0;
  let zStartIndex = -1;
  let zLength = 0;
  for (let i = 0; i < 8; ++i) {
    const section = sections[i];
    let zFlag = section === '0';
    if (zFlag && !zPreviousFlag) {
      zStartIndex = i;
    }
    if (!zFlag && zPreviousFlag) {
      zLength = i - zStartIndex;
    }
    if (zLength > 1 && zLength > zeroLength) {
      zeroStartIndex = zStartIndex;
      zeroLength = zLength;
    }
    zPreviousFlag = section === '0';
  }
  if (zPreviousFlag) {
    zLength = 8 - zStartIndex;
  }
  if (zLength > 1 && zLength > zeroLength) {
    zeroStartIndex = zStartIndex;
    zeroLength = zLength;
  }
  //console.log(zeroStartIndex, zeroLength);
  //console.log(sections);
  if (zeroStartIndex >= 0 && zeroLength > 1) {
    sections.splice(zeroStartIndex, zeroLength, 'g');
  }
  //console.log(sections);
  a = sections.join(':');
  //console.log(a);
  a = a.replace(/\:g\:/g, '::');
  a = a.replace(/\:g/g, '::');
  a = a.replace(/g\:/g, '::');
  a = a.replace(/g/g, '::');
  //console.log(a);
  return a;
};

export const normalize = (address: string): string => {
  if (IPCIDR.isValidCIDR(address)) {
    const cidr = new IPCIDR(address);

    let start = cidr.start();
    if (!cidr.addressStart.v4) {
      start = abbreviate(start);
    }
    return start + cidr.addressStart.subnet;
  }

  return '';
};
