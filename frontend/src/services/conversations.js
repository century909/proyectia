import { api } from './api';

export async function getConversations() {
  return api.get('/conversations');
}

export async function createConversation({ character_id, title }) {
  return api.post('/conversations', { character_id, title });
}

export async function getConversation(id) {
  return api.get(`/conversations/${id}`);
}

export async function deleteConversation(id) {
  return api.delete(`/conversations/${id}`);
}

