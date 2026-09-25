/** Swatches for /dev/ui-kit — names match Figma variables (docs/ai/m3-tokens.css v3). */
export const COLOR_ROLES = [
  ['primary', 'bg-primary text-on-primary'],
  ['primary-container', 'bg-primary-container text-on-primary-container'],
  ['primary-fixed-dim', 'bg-primary-fixed-dim text-on-primary-container'],
  ['secondary', 'bg-secondary text-on-secondary'],
  ['secondary-container', 'bg-secondary-container text-on-secondary-container'],
  ['background', 'bg-background text-on-background border border-outline-variant'],
  ['surface', 'bg-surface text-on-surface border border-outline-variant'],
  ['surface-bright', 'bg-surface-bright text-on-surface'],
  ['surface-variant', 'bg-surface-variant text-on-surface-variant'],
  [
    'surface-container-lowest',
    'bg-surface-container-lowest text-on-surface border border-outline-variant',
  ],
  ['surface-container-low', 'bg-surface-container-low text-on-surface'],
  ['surface-container', 'bg-surface-container text-on-surface'],
  ['surface-container-highest', 'bg-surface-container-highest text-on-surface'],
  ['inverse-on-surface', 'bg-inverse-on-surface text-on-surface'],
  ['outline', 'bg-background text-outline border border-outline'],
  ['outline-variant', 'bg-background text-on-surface-variant border border-outline-variant'],
  ['error', 'bg-error text-on-error'],
  ['featured-container', 'bg-featured-container text-featured'],
  ['rating', 'bg-surface-container text-rating'],
  ['like', 'bg-surface-container text-like'],
  ['state-primary-10', 'bg-state-primary-10 text-primary'],
  ['overlay', 'bg-overlay text-inverse-on-surface'],
] as const;

export const TYPE_SAMPLES = [
  ['headline-large', 'text-headline-large'],
  ['headline-medium', 'text-headline-medium'],
  ['headline-small', 'text-headline-small'],
  ['title-large', 'text-title-large'],
  ['title-semi-large', 'text-title-semi-large'],
  ['title-medium', 'text-title-medium'],
  ['title-small', 'text-title-small'],
  ['body-large', 'text-body-large'],
  ['body-medium', 'text-body-medium'],
  ['label-large', 'text-label-large'],
  ['label-medium', 'text-label-medium'],
  ['label-small', 'text-label-small'],
] as const;

export const SHAPES = [
  'rounded-extra-small',
  'rounded-small',
  'rounded-medium',
  'rounded-large',
  'rounded-large-increased',
  'rounded-extra-large',
] as const;
