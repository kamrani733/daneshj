import type { PublicPanelKind } from '@public-panel/types/actor';

/** Cookie value for presentation persona (public panel demo only). */
export const DEMO_PERSONA_COOKIE = 'demo_persona';

export type DemoPersonaId =
  | 'owner-individual-provider'
  | 'visitor-individual-provider'
  | 'visitor-non-provider'
  | 'guest';

export const DEFAULT_DEMO_PERSONA: DemoPersonaId = 'visitor-individual-provider';

export type DemoViewerRole = 'owner' | 'user' | 'guest';

export type DemoPersonaDefinition = {
  id: DemoPersonaId;
  /** Panel under view (fixture shape). */
  panelKind: PublicPanelKind;
  viewerRole: DemoViewerRole;
  /** Owner «درباره من» empty (guest frame `400:140940`). */
  aboutMeEmpty: boolean;
  figmaFrames: string[];
};

export const DEMO_PERSONA_DEFINITIONS: Record<DemoPersonaId, DemoPersonaDefinition> =
  {
    'owner-individual-provider': {
      id: 'owner-individual-provider',
      panelKind: 'individual',
      viewerRole: 'owner',
      aboutMeEmpty: false,
      figmaFrames: ['400:139432', '400:139600', '400:139930'],
    },
    'visitor-individual-provider': {
      id: 'visitor-individual-provider',
      panelKind: 'individual',
      viewerRole: 'user',
      aboutMeEmpty: false,
      figmaFrames: ['400:139432', '400:139762'],
    },
    'visitor-non-provider': {
      id: 'visitor-non-provider',
      panelKind: 'user',
      viewerRole: 'user',
      aboutMeEmpty: false,
      figmaFrames: ['400:140092', '400:140219'],
    },
    guest: {
      id: 'guest',
      panelKind: 'individual',
      viewerRole: 'guest',
      aboutMeEmpty: true,
      figmaFrames: ['400:140940'],
    },
  };

export const DEMO_PERSONA_IDS = Object.keys(
  DEMO_PERSONA_DEFINITIONS
) as DemoPersonaId[];

export function isDemoPersonaId(value: string): value is DemoPersonaId {
  return value in DEMO_PERSONA_DEFINITIONS;
}

export function parseDemoPersonaId(
  raw: string | undefined | null
): DemoPersonaId {
  if (raw && isDemoPersonaId(raw)) return raw;
  return DEFAULT_DEMO_PERSONA;
}

/** Signed-in demo visitor (never the panel owner fixture id). */
export const DEMO_PRESENTATION_VISITOR_ACTOR_ID = 1001;

/** Local-only token so interactive hooks enable without touching the real session. */
export const DEMO_PRESENTATION_ACCESS_TOKEN = 'demo-presentation';

export function getDemoPanelKindFromPersona(persona: DemoPersonaId): PublicPanelKind {
  return DEMO_PERSONA_DEFINITIONS[persona].panelKind;
}
