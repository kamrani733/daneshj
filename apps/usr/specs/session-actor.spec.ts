import {
  isAdminActorSession,
  isAdminActorUserId,
} from '../src/lib/session-actor';

describe('session-actor', () => {
  it('detects admin actor from session user id prefix', () => {
    expect(
      isAdminActorSession({
        user: { id: 'Admin_42', email: 'a@b.c', name: 'Admin' },
        accessToken: 't',
      })
    ).toBe(true);
    expect(
      isAdminActorSession({
        user: { id: 'User_1', email: 'u@b.c', name: 'User' },
        accessToken: 't',
      })
    ).toBe(false);
  });

  it('isAdminActorUserId matches isAdminActorSession', () => {
    expect(isAdminActorUserId('Admin_1')).toBe(true);
    expect(isAdminActorUserId('User_1')).toBe(false);
    expect(isAdminActorUserId(undefined)).toBe(false);
  });
});
