// src/api/passwordRegistration.js

import { api, getOrg } from './client';

async function ensureOrgLoaded() {
  try {
    await getOrg();
  } catch (_) {
    // Ignore org loading error here.
  }
}

export async function getPasswordRegistrationMeta() {
  await ensureOrgLoaded();

  return api('/api/password-registration/meta', {
    method: 'GET',
  });
}

export async function checkUsernameAvailability(username) {
  await ensureOrgLoaded();

  const value = String(username || '').trim();

  if (!value) {
    throw new Error('Username is required.');
  }

  return api(
    `/api/password-registration/username-available?username=${encodeURIComponent(
      value,
    )}`,
    {
      method: 'GET',
    },
  );
}

export async function submitPasswordRegistration(payload) {
  await ensureOrgLoaded();

  return api('/api/password-registration', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
