// src/api/client.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const ORG_STORAGE_KEY = 'org_config_v1'; // {code,name,logo_url,base_url}

// ==========================================
// Campus Configuration
// ==========================================

export const IS_SET_CAMPUS =
  String(Config.IS_SET_CAMPUS ?? '')
    .trim()
    .toLowerCase() === 'true';

let activeLocationId = null;

export function setActiveLocationId(locationId) {
  if (!IS_SET_CAMPUS) {
    activeLocationId = null;
    return;
  }

  const id = Number(locationId);

  activeLocationId = Number.isInteger(id) && id > 0 ? id : null;
}

export function getActiveLocationId() {
  return IS_SET_CAMPUS ? activeLocationId : null;
}

export function clearActiveLocationId() {
  activeLocationId = null;
}

// Match location-protected endpoints from the web implementation.
function isLocationProtectedPath(path) {
  const pathname = String(path || '')
    .split('?')[0]
    .replace(/^https?:\/\/[^/]+/i, '');

  return (
    /^\/api\/(?:homeworks|classworks|examinations|exams|results|class-groups|courses|attendance|forums|students|teachers|staffs|administrators|personnel|parents)(?:\/|$)/i.test(
      pathname,
    ) ||
    /^\/api\/billing\/v2(?:\/|$)/i.test(pathname) ||
    pathname === '/api/admissions/admin/options' ||
    pathname === '/students/identity-cards/pdf' ||
    pathname === '/web/students/act-as' ||
    pathname === '/api/dashboard-elements' ||
    pathname.startsWith('/api/dashboard/')
  );
}

// ==========================================
// Default Organization - Master Mind
// ==========================================

export const DEFAULT_ORG = {
  code: 'MMIND2026',
  name: 'Master Mind',
  logo_url: 'https://www.mastermindsrp.com/assets/images/logo/website-logo.png',
  base_url: 'https://learning.mastermindsrp.com',
};

// ==========================================
// Base URL Management
// ==========================================
export let BASE = DEFAULT_ORG.base_url;

export function setBase(newBase) {
  const nextBase = String(newBase || DEFAULT_ORG.base_url)
    .trim()
    .replace(/\/+$/, '');

  // Never carry an active campus across organizations.
  if (BASE !== nextBase) {
    clearActiveLocationId();
  }

  BASE = nextBase;
}

export function getBase() {
  return BASE;
}

export function absoluteUrl(path) {
  if (!path) return BASE;
  if (/^https?:\/\//i.test(path)) return path;
  const a = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const b = path.startsWith('/') ? path : `/${path}`;
  return a + b;
}

// ==========================================
// Organization Helpers
// ==========================================
export async function getOrg() {
  try {
    const raw = await AsyncStorage.getItem(ORG_STORAGE_KEY);

    if (raw) {
      const org = JSON.parse(raw);

      if (org?.base_url) {
        setBase(org.base_url);
        return org;
      }
    }

    await AsyncStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(DEFAULT_ORG));

    setBase(DEFAULT_ORG.base_url);

    return DEFAULT_ORG;
  } catch (error) {
    try {
      await AsyncStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(DEFAULT_ORG));
    } catch {}

    setBase(DEFAULT_ORG.base_url);

    return DEFAULT_ORG;
  }
}

export async function setOrg(org) {
  const clean = {
    code: String(org?.code || '').trim(),
    name: String(org?.name || '').trim(),
    logo_url: org?.logo_url ? String(org.logo_url).trim() : null,
    base_url: String(org?.base_url || '').trim(),
  };
  await AsyncStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(clean));
  if (clean.base_url) setBase(clean.base_url);
}

export async function clearOrg() {
  try {
    await AsyncStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(DEFAULT_ORG));
  } catch {}

  setBase(DEFAULT_ORG.base_url);
}

// ==========================================
// Organization-wise Token Management
// ==========================================
async function tokenKey() {
  try {
    const org = await getOrg();

    return `auth_token:${org?.code || DEFAULT_ORG.code}`;
  } catch {
    return `auth_token:${DEFAULT_ORG.code}`;
  }
}

export async function getToken() {
  try {
    return (await AsyncStorage.getItem(await tokenKey())) || null;
  } catch {
    return null;
  }
}

export async function setToken(tokenOrNull) {
  clearActiveLocationId();
  const key = await tokenKey();
  if (!tokenOrNull) {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
    return;
  }
  try {
    await AsyncStorage.setItem(key, String(tokenOrNull));
  } catch {}
}

export async function clearToken() {
  clearActiveLocationId();
  try {
    const key = await tokenKey();
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Failed to clear auth token:', error);
  }
}

// ==========================================
// Status-aware API Helper
// ==========================================
export async function api(path, opts = {}) {
  const url = absoluteUrl(path);

  const isFormData =
    typeof FormData !== 'undefined' && opts.body instanceof FormData;

  const headers = {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(opts.headers || {}),
  };

  if (isFormData) {
    delete headers['Content-Type'];
    delete headers['content-type'];
  }

  const bearer = await getToken();

  if (bearer) {
    headers.Authorization = `Bearer ${bearer}`;
  }

  // Campus-specific headers are added only when enabled.
  if (IS_SET_CAMPUS && isLocationProtectedPath(path)) {
    const locationId = getActiveLocationId();

    headers['X-Requested-With'] = 'XMLHttpRequest';

    // Do not silently send an invalid location ID.
    if (locationId) {
      headers['X-Active-Location'] = String(locationId);
    } else {
      delete headers['X-Active-Location'];
      delete headers['x-active-location'];
    }
  }

  // Use the same JSON parsing and status handling as before.
  const res = await fetch(url, {
    ...opts,
    headers,
  });

  const text = await res.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (res.status === 401 || res.status === 403) {
    await clearToken();
  }

  if (!res.ok) {
    const firstErrorKey =
      data?.errors && typeof data.errors === 'object'
        ? Object.keys(data.errors)[0]
        : null;

    const firstErrorMessage =
      firstErrorKey && Array.isArray(data.errors[firstErrorKey])
        ? data.errors[firstErrorKey][0]
        : null;

    const err = new Error(
      firstErrorMessage || data?.message || data?.error || `HTTP ${res.status}`,
    );

    err.status = res.status;
    err.payload = data;
    err.errors = data?.errors;
    err.code = data?.code;

    // Avoid logging authorization tokens.
    if (res.status === 412) {
      console.log('[LOCATION API ERROR]', {
        path,
        status: res.status,
        code: data?.code,
        message: data?.message,
        locationId: getActiveLocationId(),
      });
    }

    throw err;
  }

  return data;
}

export async function apiOrg(path, orgCode) {
  const url = absoluteUrl(path);

  var data = [
    {
      code: 'ARGUS123',
      name: 'ARGUS',
      logo_url: 'https://www.mgts.co.in/img/logo/logo-w.png',
      base_url: 'https://argus.ascendlearn.org',
    },
    {
      code: 'ALM123',
      name: 'Alif-Lam-Mim Mission',
      logo_url: 'https://ascendott.com/images/ascendott-logo.png',
      base_url: 'https://alm.ascendlearn.org',
    },
    {
      code: 'CPSA123',
      name: 'CPSA',
      logo_url:
        'https://www.clipartmax.com/png/middle/203-2037661_logo-sample-earth.png',
      base_url: 'https://cpsa.ascendlearn.org',
    },
    {
      code: 'SARA123',
      name: 'SARA',
      logo_url:
        'https://www.clipartmax.com/png/middle/203-2037661_logo-sample-earth.png',
      base_url: 'https://sara.ascendlearn.org',
    },
    {
      code: 'GOVINDAARGUS123',
      name: 'GOVINDA ARGUS',
      logo_url:
        'https://www.clipartmax.com/png/middle/203-2037661_logo-sample-earth.png',
      base_url: 'https://govinda_argus.ascendlearn.org',
    },
    {
      code: 'ENGL123',
      name: 'ENGLISH GURU',
      logo_url:
        'https://navnirmancollege.in/wp-content/uploads/2023/05/examination.jpg',
      base_url: 'https://englishguru.ascendlearn.org',
    },
    {
      code: 'AGEC123',
      name: 'Asansol Gayatri Education Centre',
      logo_url:
        'https://navnirmancollege.in/wp-content/uploads/2023/05/examination.jpg',
      base_url: 'https://gayatri.ascendlearn.org',
    },
    {
      code: 'SGA2026',
      name: 'Sciencegate Academy',
      logo_url:
        'https://learning.sciencegateacademy.com/storage/branding/logos/aX1h769FgxoVtckfZwhFpc1kjDchLdWZBmDr5YKh.png',
      base_url: 'https://learning.sciencegateacademy.com',
    },
    {
      code: 'EXCEL2026',
      name: 'One Click Test Demo Academy',
      logo_url:
        'https://excel.ascendlearn.org/storage/branding/logos/K1K82GCiXmkq0SQGQ4jUzh7buaTPHkC7OX5BqZMB.png',
      base_url: 'https://excel.ascendlearn.org',
    },
    {
      code: 'ADA2026',
      name: 'ArgusDev Academy',
      logo_url: 'https://dev.ascendlearn.org/images/logo.png',
      base_url: 'https://dev.ascendlearn.org',
    },
    {
      code: 'ARDE2026',
      name: 'ArgusDemo Academy',
      logo_url:
        'https://demo.ascendlearn.org/storage/branding/logos/6Aw5XbxgmcJPlUzrUNHea2E643X9zP6wFoHJtdUG.png',
      base_url: 'https://demo.ascendlearn.org',
    },
    {
      code: 'SRSV2026',
      name: 'Sinthi Ramakrishna Sangha Vidyamandir (Govt. Sponsd.) (H. S.)',
      logo_url: 'https://www.srsvboys.in/assets/images/brand/school-logo.webp',
      base_url: 'https://school.srsvboys.in',
    },
    {
      code: 'MMIND2026',
      name: 'Master Mind',
      logo_url:
        'https://www.mastermindsrp.com/assets/images/logo/website-logo.png',
      base_url: 'https://learning.mastermindsrp.com',
    },
  ];

  return data.find(c => c['code'] == orgCode);
}
