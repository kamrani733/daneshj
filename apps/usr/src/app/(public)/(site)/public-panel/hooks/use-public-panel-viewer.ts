'use client';

import { useMemo } from 'react';

import { isDemoModeGateEnabled } from '@/lib/demo-mode/config';
import { resolveDemoViewerContext } from '@public-panel/demo/viewer-context';
import {
  usePublicPanelDemoMode,
  usePublicPanelDemoPersona,
} from '@public-panel/components/demo-mode/public-panel-demo-provider';

export type PublicPanelViewerProps = {
  accessToken?: string | null;
  viewerActorId?: number | null;
};

export function usePublicPanelViewer(
  serverViewer: PublicPanelViewerProps,
  panelOwnerActorId: number
): PublicPanelViewerProps {
  const demoMode = usePublicPanelDemoMode();
  const persona = usePublicPanelDemoPersona();

  const { accessToken, viewerActorId } = serverViewer;

  return useMemo(() => {
    if (!demoMode || !isDemoModeGateEnabled()) {
      return { accessToken, viewerActorId };
    }
    return resolveDemoViewerContext(persona, panelOwnerActorId);
  }, [accessToken, demoMode, persona, panelOwnerActorId, viewerActorId]);
}
