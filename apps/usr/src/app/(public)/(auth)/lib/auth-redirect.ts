import { establishSession } from '@auth/lib/auth-actions';
import type { Session } from '@daneshjoam/shared-types';

export async function finishAuthAndRedirect(
  session: Session,
  successPath: string,
  clearFlow: () => void | Promise<void>
) {
  await establishSession(session);
  await clearFlow();
  window.location.assign(successPath);
}
