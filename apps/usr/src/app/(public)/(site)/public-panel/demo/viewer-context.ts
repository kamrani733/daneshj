import {
  DEMO_PERSONA_DEFINITIONS,
  DEMO_PRESENTATION_ACCESS_TOKEN,
  DEMO_PRESENTATION_ADMIN_ACTOR_ID,
  DEMO_PRESENTATION_VISITOR_ACTOR_ID,
  type DemoPersonaId,
} from '@/lib/demo-mode/persona';

export type PublicPanelViewerContext = {
  viewerActorId: number | null;
  accessToken: string | null;
  viewerIsAdmin: boolean;
};

/** Demo-only viewer identity; never use outside demo mode + gate. */
export function resolveDemoViewerContext(
  persona: DemoPersonaId,
  panelOwnerActorId: number
): PublicPanelViewerContext {
  const { viewerRole } = DEMO_PERSONA_DEFINITIONS[persona];
  switch (viewerRole) {
    case 'owner':
      return {
        viewerActorId: panelOwnerActorId,
        accessToken: DEMO_PRESENTATION_ACCESS_TOKEN,
        viewerIsAdmin: false,
      };
    case 'user':
      return {
        viewerActorId: DEMO_PRESENTATION_VISITOR_ACTOR_ID,
        accessToken: DEMO_PRESENTATION_ACCESS_TOKEN,
        viewerIsAdmin: false,
      };
    case 'admin':
      return {
        viewerActorId: DEMO_PRESENTATION_ADMIN_ACTOR_ID,
        accessToken: DEMO_PRESENTATION_ACCESS_TOKEN,
        viewerIsAdmin: true,
      };
    case 'guest':
    default:
      return { viewerActorId: null, accessToken: null, viewerIsAdmin: false };
  }
}
