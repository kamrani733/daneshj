'use server';

import { login } from '@daneshjoam/auth';
import type { Session } from '@daneshjoam/shared-types';

export async function establishSession(session: Session) {
  await login(session);
}
