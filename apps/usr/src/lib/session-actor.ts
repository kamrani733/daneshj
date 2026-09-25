import type { Session } from '@daneshjoam/shared-types';

/** Auth MS Admin actor — session `user.id` is `Admin_{sub}` (see temporary admin login). */
export function isAdminActorSession(
  session: Session | null | undefined
): boolean {
  const id = session?.user.id;
  return typeof id === 'string' && id.startsWith('Admin_');
}

/** Same check when only the persisted session user id is available (e.g. client query payloads). */
export function isAdminActorUserId(userId: string | null | undefined): boolean {
  return typeof userId === 'string' && userId.startsWith('Admin_');
}
