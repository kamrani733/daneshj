import {
  DEMO_PERSONA_DEFINITIONS,
  DEMO_PRESENTATION_ACCESS_TOKEN,
  DEMO_PRESENTATION_VISITOR_ACTOR_ID,
  type DemoPersonaId,
} from '@/lib/demo-mode/persona';

export type PublicPanelViewerContext = {
  viewerActorId: number | null;
  accessToken: string | null;
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
      };
    case 'user':
      return {
        viewerActorId: DEMO_PRESENTATION_VISITOR_ACTOR_ID,
        accessToken: DEMO_PRESENTATION_ACCESS_TOKEN,
      };
    case 'guest':
      return {
        viewerActorId: null,
        accessToken: null,
      };
    default:
      return { viewerActorId: null, accessToken: null };
  }
}
