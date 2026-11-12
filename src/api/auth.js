// src/api/auth.js
import { api, getOrg } from './client';

export function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
}

export function isPhone(v) {
  // supports +XXXXXXXX or digits; 7-15 length
  return /^\+?\d{7,15}$/.test(String(v || '').trim());
}

function normalizeIdentifier(identifier) {
  return String(identifier || '').trim();
}

function normalizePhone(identifier) {
  const raw = String(identifier || '').trim();
  if (!raw) return raw;
  return raw.startsWith('+') ? raw : `+${raw}`;
}

// Ensure org is loaded so BASE is correct (no-op if already stored)
async function ensureOrgLoaded() {
  try {
    await getOrg(); // getOrg() internally sets BASE if org exists
  } catch (_) {
    // ignore
  }
}

/** request code to email or phone */
export async function requestOtp(identifier) {
  await ensureOrgLoaded();

  const id = normalizeIdentifier(identifier);

  if (isEmail(id)) {
    // some backends expect { email }, some expect { identifier }
    return api('/api/auth/request-email-otp', {
      method: 'POST',
      body: JSON.stringify({ email: id, identifier: id }),
    });
  }

  if (isPhone(id)) {
    const phone = normalizePhone(id);
    return api('/api/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, identifier: phone }),
    });
  }

  throw new Error('Enter a valid email or phone.');
}

/** verify code for email or phone; returns raw server JSON */
export async function verifyOtp(identifier, code) {
  await ensureOrgLoaded();

  const id = normalizeIdentifier(identifier);
  const c = String(code || '').trim();

  if (!c) throw new Error('Enter the OTP.');

  if (isEmail(id)) {
    // Some servers use { code }, some use { otp }
    return api('/api/auth/verify-email-otp', {
      method: 'POST',
      body: JSON.stringify({ email: id, code: c, otp: c, identifier: id }),
    });
  }

  if (isPhone(id)) {
    const phone = normalizePhone(id);
    return api('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code: c, otp: c, identifier: phone }),
    });
  }

  throw new Error('Enter a valid email or phone.');
}

/**
 * Login with username and password.
 * Returns raw server JSON.
 */
export async function loginWithPassword(username, password) {
  await ensureOrgLoaded();

  const u = String(username || '').trim();
  const p = String(password || '');

  if (!u) {
    throw new Error('Enter your username.');
  }

  if (!p) {
    throw new Error('Enter your password.');
  }

  return api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: u,
      password: p,
    }),
  });
}

/** pull a token from various possible shapes */
export function extractToken(payload) {
  if (!payload) return null;

  // direct
  if (payload.access_token) return payload.access_token;
  if (payload.token) return payload.token;

  // nested common
  if (payload.data?.access_token) return payload.data.access_token;
  if (payload.data?.token) return payload.data.token;

  // other shapes
  if (payload.auth?.access_token) return payload.auth.access_token;
  if (payload.auth?.token) return payload.auth.token;

  // headers-based tokens won't be here (handled in client.js if you add it)
  return null;
}

/*** Get available password reset delivery options. */
export async function getPasswordResetOptions(identifier) {
  await ensureOrgLoaded();

  const value = String(identifier || '').trim();

  if (!value) {
    throw new Error('Enter your username or student email.');
  }

  return api('/api/auth/password-reset/options', {
    method: 'POST',
    body: JSON.stringify({
      username: value,
    }),
  });
}

/*** Send password reset verification code. */
export async function sendPasswordResetCode(username, destinationKey) {
  await ensureOrgLoaded();

  const value = String(username || '').trim();

  if (!value) {
    throw new Error('Username or student email is required.');
  }

  if (!destinationKey) {
    throw new Error('Please select where to receive the verification code.');
  }

  return api('/api/auth/password-reset/send', {
    method: 'POST',
    body: JSON.stringify({
      username: value,
      destination_key: destinationKey,
    }),
  });
}

export async function verifyPasswordResetCode(challengeId, code) {
  await ensureOrgLoaded();

  const verificationCode = String(code || '').trim();

  if (!challengeId) {
    throw new Error('Password reset challenge is missing.');
  }

  if (!verificationCode) {
    throw new Error('Enter the verification code.');
  }

  return api('/api/auth/password-reset/verify', {
    method: 'POST',
    body: JSON.stringify({
      challenge_id: challengeId,
      code: verificationCode,
    }),
  });
}

/*** Complete password reset. */
export async function completePasswordReset({
  challengeId,
  resetToken,
  password,
  passwordConfirmation,
}) {
  await ensureOrgLoaded();

  if (!challengeId) {
    throw new Error('Password reset challenge is missing.');
  }

  if (!resetToken) {
    throw new Error('Password reset token is missing.');
  }

  return api('/api/auth/password-reset/complete', {
    method: 'POST',
    body: JSON.stringify({
      challenge_id: challengeId,
      reset_token: resetToken,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
}
