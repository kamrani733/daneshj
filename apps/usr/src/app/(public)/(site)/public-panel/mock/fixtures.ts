import type { PublicPanelKind } from '@public-panel/types/actor';
import type { PublicPanelProfile } from '@public-panel/types/ui';

import { MOCK_PUBLIC_PANEL } from '@public-panel/data/public-panel-mock';

/** Default owner id for demo presentations when URL has no actor_id. */
export const DEMO_DEFAULT_ACTOR_ID = MOCK_PUBLIC_PANEL.actorId;

export function getDemoPublicPanelProfile(
  actorId?: number | null,
  _kind: PublicPanelKind = 'individual'
): PublicPanelProfile {
  const resolvedId =
    actorId != null && actorId > 0 ? actorId : DEMO_DEFAULT_ACTOR_ID;
  return {
    ...MOCK_PUBLIC_PANEL,
    actorId: resolvedId,
    actorType: MOCK_PUBLIC_PANEL.actorType,
    comments: structuredClone(MOCK_PUBLIC_PANEL.comments),
  };
}
