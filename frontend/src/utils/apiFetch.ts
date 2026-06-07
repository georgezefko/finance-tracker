import { AuthContext } from '../context/AuthContext';

const RAW_BASE_URL =
  process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

// strip trailing slashes from base URL
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');


function buildUrl(path: string): string {

  if (/^https?:\/\//i.test(path)) {
    throw new Error(`apiFetch expected a relative path but got full URL: ${path}`);
  }
  // ensure path starts with exactly one leading slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
}


export async function apiFetch(
  path: string,
  options: RequestInit = {},
  authContext: React.ContextType<typeof AuthContext>
) {
  const url = buildUrl(path);

  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (err) {
    // Network error / server unreachable — not an authentication problem,
    // so don't destroy the session.
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  }

  // Auth endpoints (login/signup) return their own 401 ("Invalid credentials")
  // that the caller needs to read — never force a logout for those.
  const isAuthEndpoint = path.startsWith('/api/auth');

  // Real auth failures: log out and bounce to login.
  if (!isAuthEndpoint && (response.status === 401 || response.status === 403)) {
    if (authContext && authContext.logout) {
      authContext.logout();
    }
    throw new Error('Session expired. Please log in again.');
  }

  // Server errors are transient (e.g. a cold-started backend). Surface them as a
  // retryable error WITHOUT logging the user out and discarding a valid session.
  if (!isAuthEndpoint && response.status >= 500) {
    throw new Error('The server had a problem. Please try again in a moment.');
  }

  return response;
} 