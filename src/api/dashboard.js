// src/api/dashboard.js
import { api } from './client';

export async function fetchDashboard() {
  // Your web already serves this; returning either array or {items:[...]} is handled below
  return api('/api/dashboard-elements');
}
