import { useCallback, useEffect, useState } from 'react';

export type AsyncResult<T> =
  | { status: 'pending' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

export function useAsync<T>(loader: () => Promise<T>) {
  const [result, setResult] = useState<AsyncResult<T>>({ status: 'pending' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    loader().then(
      (data) => {
        if (active) {
          setResult({ status: 'success', data });
        }
      },
      (cause: unknown) => {
        if (active) {
          setResult({
            status: 'error',
            error: cause instanceof Error ? cause : new Error('Terjadi kesalahan tak terduga.'),
          });
        }
      },
    );

    return () => {
      active = false;
    };
  }, [loader, attempt]);

  const reload = useCallback(() => {
    setResult({ status: 'pending' });
    setAttempt((value) => value + 1);
  }, []);

  return { result, reload };
}
