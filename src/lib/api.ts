import { API_BASE_URL } from '@/constants/config';

export async function apiGet<T>(path: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not configured');
  }

  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`GET ${path} failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
