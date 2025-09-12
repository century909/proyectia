import { api } from './api';

export async function getMessages(conversationId) {
  return api.get(`/messages?conversation_id=${conversationId}`);
}

export async function sendMessage({ conversation_id, content }) {
  return api.post('/messages', { conversation_id, content });
}

