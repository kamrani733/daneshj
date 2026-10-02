'use client';

import { useMemo } from 'react';

import {
  getPublicPanelCapabilities,
  type PublicPanelCapabilities,
} from '@public-panel/capabilities';
import type { PublicPanelProfile } from '@public-panel/types/ui';

import type { PublicPanelViewerProps } from '@public-panel/hooks/use-public-panel-viewer';

export function usePublicPanelCapabilities(
  profile: Pick<PublicPanelProfile, 'actorId' | 'providerBadgeKey'>,
  viewer: PublicPanelViewerProps
): PublicPanelCapabilities {
  return useMemo(
    () =>
      getPublicPanelCapabilities({
        profile,
        viewerActorId: viewer.viewerActorId,
        accessToken: viewer.accessToken,
        viewerIsAdmin: viewer.viewerIsAdmin,
      }),
    [profile, viewer.accessToken, viewer.viewerActorId, viewer.viewerIsAdmin]
  );
}
