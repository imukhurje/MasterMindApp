// Load *before* anything that might import echo/pusher/etc.
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Buffer (Node) for libs that expect it
import { Buffer } from 'buffer';
if (!global.Buffer) global.Buffer = Buffer;

// Ensure global crypto exists
if (!global.crypto) global.crypto = {};

// Polyfill crypto.randomInt using crypto.getRandomValues (rejection sampling)
if (typeof global.crypto.randomInt !== 'function') {
  global.crypto.randomInt = function randomInt(min, max, cb) {
    // Node-style API: randomInt(max) or randomInt(min, max, [cb])
    if (max === undefined) { max = min; min = 0; }
    min = Math.floor(min);
    max = Math.floor(max);
    if (!(max > min)) {
      const err = new RangeError('max must be > min');
      if (cb) return cb(err);
      throw err;
    }
    const range = max - min;
    if (range > 0x1_0000_0000) {
      const err = new RangeError('range > 2^32 not supported');
      if (cb) return cb(err);
      throw err;
    }

    const random32 = () => {
      const arr = new Uint32Array(1);
      global.crypto.getRandomValues(arr);
      return arr[0];
    };

    // unbiased modulo via rejection sampling
    const MAX = 0x1_0000_0000; // 2^32
    const limit = MAX - (MAX % range);
    let x;
    do { x = random32(); } while (x >= limit);
    const n = min + (x % range);

    if (cb) { setImmediate ? setImmediate(() => cb(null, n)) : setTimeout(() => cb(null, n), 0); return; }
    return n;
  };
}
