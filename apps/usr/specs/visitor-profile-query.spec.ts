import { canFetchVisitorProfile } from '@public-panel/api/actor-query';

describe('canFetchVisitorProfile', () => {
  it('enables a visitor profile fetch without NEXT_PUBLIC_ACTOR_API_URL or a token', () => {
    delete process.env.NEXT_PUBLIC_ACTOR_API_URL;
    expect(canFetchVisitorProfile(12)).toBe(true);
  });

  it('does not fetch when actor id is missing', () => {
    expect(canFetchVisitorProfile(0)).toBe(false);
  });
});
