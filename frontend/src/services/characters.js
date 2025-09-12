import { api } from './api';

export async function getCharacters() {
  return api.get('/characters');
}

export async function createCharacter({ name, description, personality }) {
  return api.post('/characters', { name, description, personality });
}

export async function getCharacter(id) {
  return api.get(`/characters/${id}`);
}

export async function deleteCharacter(id) {
  return api.delete(`/characters/${id}`);
}

export async function updateCharacterAvatar(id, avatarUrl) {
  return api.patch(`/characters/${id}/avatar`, { avatar_url: avatarUrl });
}

