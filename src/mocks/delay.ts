let failurePending = false;

export function setMockFailure(pending: boolean) {
  failurePending = pending;
}

export async function simulateNetwork<T>(payload: T, delayMs = 550): Promise<T> {
  await new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

  if (failurePending) {
    failurePending = false;
    throw new Error('Koneksi ke dapur sedang sibuk.');
  }

  return payload;
}
