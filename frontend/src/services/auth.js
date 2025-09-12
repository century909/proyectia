import { api } from './api';

export async function loginWithEmailPassword({ email, password }) {
  // Ajusta el endpoint según tu backend
  return api.post('/auth/login', { email, password });
}

export async function registerWithEmailPassword({ username, email, password }) {
  return api.post('/auth/register', { username, email, password });
}

export async function getCurrentUser() {
  return api.get('/auth/me');
}



