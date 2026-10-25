import { API_BASE_URL } from '@/constants/config';

const TIMEOUT_MS = 10_000;

async function readErrorMessage(response: Response): Promise<string | null> {
  try {
    const body = (await response.json()) as { message?: unknown };
    return typeof body?.message === 'string' ? body.message : null;
  } catch {
    return null;
  }
}

// AbortError di React Native bisa berupa DOMException, yang belum tentu
// `instanceof Error`, jadi periksa lewat `name`.
function isAbort(cause: unknown): boolean {
  return (
    typeof cause === 'object' &&
    cause !== null &&
    (cause as { name?: unknown }).name === 'AbortError'
  );
}

export async function apiGet<T>(path: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not configured');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { signal: controller.signal });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw new Error(message ?? `GET ${path} gagal dengan status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (cause) {
    if (isAbort(cause)) {
      throw new Error(
        `Server tidak merespons dalam ${TIMEOUT_MS / 1000} detik (${API_BASE_URL}). Pastikan backend jalan dan bisa diakses dari perangkat ini.`
      );
    }

    // fetch melempar TypeError untuk kegagalan jaringan (host salah/tidak hidup).
    // Error dari backend sudah berupa Error biasa, jadi tidak ikut dibungkus.
    if (cause instanceof TypeError) {
      throw new Error(
        `Tidak bisa terhubung ke ${API_BASE_URL}. Pastikan backend jalan dan alamatnya bisa diakses dari perangkat ini.`
      );
    }

    throw cause;
  } finally {
    clearTimeout(timer);
  }
}
