import { AuthContext } from '../context/AuthContext';

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  authContext: React.ContextType<typeof AuthContext>
) {
  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403 || response.status === 500) {
    if (authContext && authContext.logout) {
      authContext.logout();
    }
    throw new Error('Session expired. Please log in again.');
  }

  return response;
} 