import { withMockFallback } from '@daneshjoam/api-client';

import { isAuthApiMocked } from '../src/app/(public)/(auth)/api/mock';

describe('isAuthApiMocked', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it('is false in production even when NEXT_PUBLIC_API_URL is unset', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(isAuthApiMocked()).toBe(false);
  });

  it('is true in development when NEXT_PUBLIC_API_URL is unset', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(isAuthApiMocked()).toBe(true);
  });

  it('is false in development when NEXT_PUBLIC_API_URL is set', () => {
    process.env.NODE_ENV = 'development';
    process.env.NEXT_PUBLIC_API_URL = 'http://127.0.0.1:3009';
    expect(isAuthApiMocked()).toBe(false);
  });
});

describe('withMockFallback', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('returns the fetcher result when the request succeeds', async () => {
    process.env.NODE_ENV = 'production';
    await expect(withMockFallback(async () => 'real', 'mock')).resolves.toBe('real');
  });

  it('returns mock data when the request fails outside production', async () => {
    process.env.NODE_ENV = 'development';
    await expect(
      withMockFallback(async () => {
        throw new Error('down');
      }, 'mock')
    ).resolves.toBe('mock');
  });

  it('rethrows when the request fails in production', async () => {
    process.env.NODE_ENV = 'production';
    await expect(
      withMockFallback(async () => {
        throw new Error('down');
      }, 'mock')
    ).rejects.toThrow('down');
  });
});
