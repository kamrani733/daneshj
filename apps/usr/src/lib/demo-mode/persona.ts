import type { PublicPanelKind } from '@public-panel/types/actor';

/** Cookie value for presentation persona (public panel demo only). */
export const DEMO_PERSONA_COOKIE = 'demo_persona';

/**
 * Viewer role × panel type. Roles follow the Expectation (User) role table
 * «نقش عملگرها در صفحه پنل عمومی»: owner, signed-in user, guest, admin.
 */
export type DemoViewerRole = 'owner' | 'user' | 'guest' | 'admin';

/** `individual` = individual service provider panel; `user` = regular user panel. */
export type DemoPanelKind = Extract<PublicPanelKind, 'individual' | 'user'>;

export type DemoPersonaId =
  | 'owner-individual-provider'
  | 'owner-non-provider'
  | 'visitor-individual-provider'
  | 'visitor-non-provider'
  | 'guest-individual-provider'
  | 'guest-non-provider'
  | 'admin-individual-provider'
  | 'admin-non-provider';

export const DEFAULT_DEMO_PERSONA: DemoPersonaId = 'visitor-individual-provider';

export type DemoPersonaDefinition = {
  id: DemoPersonaId;
  /** Panel under view (fixture shape). */
  panelKind: DemoPanelKind;
  viewerRole: DemoViewerRole;
  /** Owner «درباره من» empty — guest export («User view», owner left it empty). */
  aboutMeEmpty: boolean;
};

function definition(
  id: DemoPersonaId,
  viewerRole: DemoViewerRole,
  panelKind: DemoPanelKind
): DemoPersonaDefinition {
  return { id, viewerRole, panelKind, aboutMeEmpty: viewerRole === 'guest' };
}

export const DEMO_PERSONA_DEFINITIONS: Record<DemoPersonaId, DemoPersonaDefinition> =
  {
    'owner-individual-provider': definition('owner-individual-provider', 'owner', 'individual'),
    'owner-non-provider': definition('owner-non-provider', 'owner', 'user'),
    'visitor-individual-provider': definition('visitor-individual-provider', 'user', 'individual'),
    'visitor-non-provider': definition('visitor-non-provider', 'user', 'user'),
    'guest-individual-provider': definition('guest-individual-provider', 'guest', 'individual'),
    'guest-non-provider': definition('guest-non-provider', 'guest', 'user'),
    'admin-individual-provider': definition('admin-individual-provider', 'admin', 'individual'),
    'admin-non-provider': definition('admin-non-provider', 'admin', 'user'),
  };

export const DEMO_PERSONA_IDS = Object.keys(
  DEMO_PERSONA_DEFINITIONS
) as DemoPersonaId[];

/** Cookies written before the persona matrix existed. */
const LEGACY_PERSONA_IDS: Record<string, DemoPersonaId> = {
  guest: 'guest-individual-provider',
};

export function isDemoPersonaId(value: string): value is DemoPersonaId {
  return value in DEMO_PERSONA_DEFINITIONS;
}

export function parseDemoPersonaId(
  raw: string | undefined | null
): DemoPersonaId {
  if (raw && isDemoPersonaId(raw)) return raw;
  if (raw && raw in LEGACY_PERSONA_IDS) return LEGACY_PERSONA_IDS[raw];
  return DEFAULT_DEMO_PERSONA;
}

/** Signed-in demo visitor (never the panel owner fixture id). */
export const DEMO_PRESENTATION_VISITOR_ACTOR_ID = 1001;

/** Demo admin viewer id (not a panel owner). */
export const DEMO_PRESENTATION_ADMIN_ACTOR_ID = 9001;

/** Local-only token so interactive hooks enable without touching the real session. */
export const DEMO_PRESENTATION_ACCESS_TOKEN = 'demo-presentation';

export function getDemoPanelKindFromPersona(persona: DemoPersonaId): DemoPanelKind {
  return DEMO_PERSONA_DEFINITIONS[persona].panelKind;
}
