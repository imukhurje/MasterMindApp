// src/screens/Admin/Accounts/utils/accountsHelpers.js

export function getTodayIso() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getSevenDaysAgoIso() {
  const date = new Date();

  date.setDate(date.getDate() - 6);

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(value) {
  if (!value) {
    return 'Select date';
  }

  const parts = String(value).split('-');

  if (parts.length !== 3) {
    return value;
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export function formatMoney(value, symbol = '₹') {
  const numeric = Number(value) || 0;

  const prefix = numeric < 0 ? '-' : '';

  return `${prefix}${symbol}${Math.abs(numeric).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function safeItems(response) {
  return Array.isArray(response?.items) ? response.items : [];
}

export function getSettledValue(result, fallback) {
  return result?.status === 'fulfilled' ? result.value : fallback;
}
