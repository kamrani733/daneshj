/** Surfaces and accents for the private panel — tokens from `globals.css` / Figma dark #1:10043. */

export const ppTheme = {
  title: 'text-primary-700 dark:text-primary-100',
  titleBar: 'bg-primary dark:bg-primary-100',
  subtitle: 'text-app-filter-muted dark:text-app-filter-ink',
  body: 'text-content dark:text-app-filter-ink',
  muted: 'text-app-filter-muted',
  accent: 'text-primary dark:text-primary-100',
  accentFill: 'bg-primary dark:bg-primary-100',
  bullet: 'bg-primary dark:bg-primary-100',
  tabTrack: 'bg-app-search-category',
  tabIdle: 'text-primary dark:text-primary-100',
  tabActive:
    'bg-app-scene text-primary dark:bg-app-card dark:text-primary-100',
  card: 'border-border bg-app-search-fill dark:border-auth-input-border dark:bg-app-search-fill',
  cardLegend:
    'bg-app-search-fill text-app-filter-muted dark:bg-app-search-fill dark:text-primary-100',
  hairline: 'border-border dark:border-auth-input-border',
  save: 'bg-primary text-white hover:bg-primary/90 dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-100/90',
  ghost: 'text-primary dark:text-primary-100',
  warningOutline:
    'border-warning text-warning dark:border-warning-100 dark:text-warning-100',
  icon: 'text-app-filter-muted',
} as const;
