/** Public-ops UI types (restrictions have no Actor MS endpoint in current YAML). */

export type PublicPanelRestriction = {
  id: string;
  titleKey: 'one' | 'two';
  period: string;
  scope: string;
  reason: string;
};
