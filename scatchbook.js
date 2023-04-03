function addrToNumber(addr) {
  return addr.split('.').reduce((acc, cur, i) => (acc += Number(cur) << ((3 - i) * 8)), 0);
}
function numberToAddr(num) {
  return `${(num >> 24) & 0xff}.${(num >> 16) & 0xff}.${(num >> 8) & 0xff}.${num & 0xff}`;
}

const ipAddr = '103.21.244.1';

const ipValue = addrToNumber(ipAddr);

let possibleCIDR = [...Array(33)].map((_, i) => {
  let mask = i == 0 ? 0 : (0xffffffff << (32 - i)) >>> 0;
  return `${numberToAddr(ipValue & mask)}/${i}`;
});

console.log(possibleCIDR);
