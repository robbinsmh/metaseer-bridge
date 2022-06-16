const Base58 = require('base-58');
const { blake3 } = require('hash-wasm');

async function test() {
  let message =
    'message should have 32-byte length, if you have some other length you can hash message, te length, if you have some other length you can hash messagea';
  const key = '49MjbE9RiUjpLGdiG88LtdxM1w4vYZns';

  const hash = await blake3(message, 256, key);

  console.log('hash:', hash.toString('hex'));
}

test();
