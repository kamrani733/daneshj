/** «مدیریت سرویس‌ها» — provisional shapes (mocked; no endpoint in `docs/api/`). */

/** Services drawn in the export, in display order. Names: `operationalPanel.manageServices.services.<key>`. */
export const MANAGED_SERVICE_KEYS = [
  'discount',
  'referral',
  'patogh',
  'universityPrograms',
  'rewards',
  'news',
  'calendarEvents',
  'newsletter',
] as const;

export type ManagedServiceKey = (typeof MANAGED_SERVICE_KEYS)[number];

export type ManagedService = {
  key: ManagedServiceKey;
  activeProducts: number;
  inactiveProducts: number;
  /** The service's own operational panel — internal path; `null` until that panel exists. */
  panelHref: string | null;
};
