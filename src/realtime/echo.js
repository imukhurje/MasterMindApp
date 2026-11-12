// src/realtime/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';
import { absoluteUrl, getToken } from '../api/client';

let _echo = null;
let _initPromise = null;

function ensureCrypto() {
  // Make sure polyfills exist even if app polyfills didn't run yet.
  if (!global.crypto) global.crypto = {};

  // Ensure getRandomValues (react-native-get-random-values normally adds this)
  if (typeof global.crypto.getRandomValues !== 'function') {
    try {
      require('react-native-get-random-values');
    } catch {}
  }

  // Polyfill crypto.randomInt (used by some Pusher codepaths)
  if (typeof global.crypto.randomInt !== 'function') {
    global.crypto.randomInt = function randomInt(min, max, cb) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      min = Math.floor(min);
      max = Math.floor(max);
      if (!(max > min)) {
        const err = new RangeError('max must be > min');
        if (cb) return cb(err);
        throw err;
      }
      const range = max - min;
      const MAX = 0x1_0000_0000; // 2^32
      const limit = MAX - (MAX % range);
      const arr = new Uint32Array(1);
      const rnd32 = () => {
        global.crypto.getRandomValues(arr);
        return arr[0];
      };
      let x;
      do {
        x = rnd32();
      } while (x >= limit);
      const n = min + (x % range);
      if (cb) {
        setTimeout(() => cb(null, n), 0);
        return;
      }
      return n;
    };
  }
}

export async function initEcho() {
  if (_echo) return _echo;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    try {
      ensureCrypto();

      const client = new Pusher('reverb', {
        wsHost: 'argus.ascendlearn.org',
        wsPort: 443,
        wssPort: 443,
        forceTLS: true,
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
        activityTimeout: 30000,
        pongTimeout: 30000,
        cluster: 'mt1',
        authorizer: channel => ({
          authorize: async (socketId, callback) => {
            try {
              const token = await getToken();
              const res = await fetch(absoluteUrl('/broadcasting/auth'), {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name,
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok)
                throw new Error(data?.message || `Auth ${res.status}`);
              callback(false, data);
            } catch (err) {
              callback(true, err);
            }
          },
        }),
      });

      _echo = new Echo({ broadcaster: 'pusher', client });
      try {
        client.connection.bind('connected', () =>
          console.log('[Echo] connected'),
        );
        client.connection.bind('disconnected', () =>
          console.log('[Echo] disconnected'),
        );
        client.connection.bind('error', e => console.warn('[Echo] error', e));
      } catch {}
      return _echo;
    } catch (err) {
      console.warn('[Echo] init failed (continuing)', err?.message || err);
      _echo = null;
      throw err;
    } finally {
      _initPromise = null;
    }
  })();

  return _initPromise;
}

export function getEcho() {
  return _echo;
}

export function joinExamChannel(examId, { started, ended } = {}) {
  if (!_echo) {
    console.warn('[Echo] joinExamChannel called before initEcho()');
    return () => {};
  }
  const ch = _echo.private(`exam.${examId}`);
  if (started) ch.listen('.ExamStarted', started);
  if (ended) ch.listen('.ExamEnded', ended);
  return () => {
    try {
      ch.stopListening('.ExamStarted');
    } catch {}
    try {
      ch.stopListening('.ExamEnded');
    } catch {}
    try {
      _echo.leave(`exam.${examId}`);
    } catch {}
  };
}

export function leaveExamChannel(examId) {
  try {
    _echo?.leave(`exam.${examId}`);
  } catch {}
}
