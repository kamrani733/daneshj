import {
  DEFAULT_DEMO_PERSONA,
  DEMO_PERSONA_DEFINITIONS,
  getDemoPanelKindFromPersona,
  type DemoPersonaId,
} from '@/lib/demo-mode/persona';
import type { PublicPanelKind } from '@public-panel/types/actor';
import type { PublicPanelProfile } from '@public-panel/types/ui';

import { MOCK_PUBLIC_PANEL } from '@public-panel/data/public-panel-mock';
import { EMPTY_PUBLIC_PANEL } from '@public-panel/data/public-panel-ui';

/** Default owner id for demo presentations when URL has no actor_id. */
export const DEMO_DEFAULT_ACTOR_ID = MOCK_PUBLIC_PANEL.actorId;

function buildNonProviderProfile(base: PublicPanelProfile): PublicPanelProfile {
  return {
    ...base,
    providerBadgeKey: null,
    serviceSocialLinks: [],
    serviceCatalog: { ...EMPTY_PUBLIC_PANEL.serviceCatalog },
    otherInfo: {
      resume: base.otherInfo.resume,
      portfolio: [],
      certificates: [],
    },
  };
}

export function getDemoPublicPanelProfile(
  actorId?: number | null,
  _kind: PublicPanelKind = 'individual',
  persona: DemoPersonaId = DEFAULT_DEMO_PERSONA
): PublicPanelProfile {
  const resolvedId =
    actorId != null && actorId > 0 ? actorId : DEMO_DEFAULT_ACTOR_ID;
  const def = DEMO_PERSONA_DEFINITIONS[persona];
  const effectiveKind = getDemoPanelKindFromPersona(persona);

  let profile: PublicPanelProfile = {
    ...MOCK_PUBLIC_PANEL,
    actorId: resolvedId,
    actorType: MOCK_PUBLIC_PANEL.actorType,
    comments: structuredClone(MOCK_PUBLIC_PANEL.comments),
  };

  if (def.aboutMeEmpty) {
    profile = { ...profile, bio: '' };
  }

  if (effectiveKind === 'user') {
    profile = buildNonProviderProfile(profile);
  }

  return profile;
}
