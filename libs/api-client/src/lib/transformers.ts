export function toRequestQuery<T extends Record<string, unknown>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

export async function withMockFallback<T>(
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  // next build inlines NODE_ENV, so the fallback branch is absent from production bundles.
  if (process.env.NODE_ENV === 'production') {
    return fetcher();
  }

  try {
    return await fetcher();
  } catch (error) {
    console.warn('Falling back to mock data.', error);
    return fallback;
  }
}
