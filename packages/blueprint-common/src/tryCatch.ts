export async function tryCatch<TSuccess, TFailure>(
  fn: () => Promise<TSuccess>,
  fallback: () => TFailure,
): Promise<TSuccess | TFailure> {
  try {
    return await fn();
  } catch (e) {
    return fallback();
  }
}
