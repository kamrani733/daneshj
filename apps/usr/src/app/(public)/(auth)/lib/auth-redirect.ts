import { establishSession } from '@auth/lib/auth-actions';
import type { Session } from '@daneshjoam/shared-types';

export async function finishAuthAndRedirect(
  session: Session,
  successPath: string,
  clearFlow: () => void
) {
  await establishSession(session);
  clearFlow();
  window.location.assign(successPath);
}
