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

  // For debugging 
  console.log('apiFetch -> path:', path, 'url:', url);
  const response = await fetch(url, options);

  // Auth failures: logout + session message
  if (response.status === 401 || response.status === 403) {
    authContext?.logout?.();
    throw new Error('Session expired. Please log in again.');
  }

  // Server errors: keep 500 handling, but don't logout
  if (response.status === 500) {
    const text = await response.text().catch(() => '');
    throw new Error(`Server error (500). ${text || 'Please try again later.'}`);
  }

  // Any other non-OK
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Request failed (${response.status}). ${text}`);
  }

  return response;
} 