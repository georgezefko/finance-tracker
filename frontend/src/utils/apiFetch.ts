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
  if (response.status === 401 || response.status === 403 || response.status === 500) {
    if (authContext && authContext.logout) {
      authContext.logout();
    }
    throw new Error('Session expired. Please log in again.');
  }

  return response;
} 