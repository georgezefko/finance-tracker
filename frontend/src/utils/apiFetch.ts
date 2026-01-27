import { AuthContext } from '../context/AuthContext';

const BASE_URL =
  process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  authContext: React.ContextType<typeof AuthContext>
) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403 || response.status === 500) {
    if (authContext && authContext.logout) {
      authContext.logout();
    }
    throw new Error('Session expired. Please log in again.');
  }

  return response;
} 