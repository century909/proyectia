import { api } from './api';

export async function getTokenBalance() {
  return api.get('/users/tokens');
}

export async function purchaseTokens(amount) {
  return api.post('/users/tokens/purchase', { amount });
}

