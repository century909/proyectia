let authToken = null;
const listeners = new Set();

export function setAuthToken(token) {
  authToken = token || null;
}

export function onApiEvent(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(event, payload) {
  listeners.forEach((ln) => {
    try { ln(event, payload); } catch (_) {}
  });
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

function getBaseUrl() {
  const fromEnv = import.meta?.env?.VITE_API_URL;
  return fromEnv ? `${fromEnv}/api` : 'http://localhost:5000/api';
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const url = `${getBaseUrl()}${path}`;
  const mergedHeaders = { ...DEFAULT_HEADERS, ...headers };
  if (authToken) {
    mergedHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method,
    headers: mergedHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message = (data && data.message) || response.statusText || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    if (response.status === 401) {
      emit('unauthorized', { message });
    }
    throw error;
  }
  return data;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};


