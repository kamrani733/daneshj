// MOCK ONLY — fake «مدیریت سرویس‌ها» list (counts from the export). Imported by `@operational-panel/api` only.
import { MANAGED_SERVICE_KEYS, type ManagedService } from '@operational-panel/types/services';

const LATENCY_MS = 300;

export function mockGetManagedServices(): Promise<ManagedService[]> {
  const services = MANAGED_SERVICE_KEYS.map((key) => ({
    key,
    activeProducts: 3,
    inactiveProducts: 2,
    panelHref: null,
  }));
  return new Promise((resolve) => setTimeout(() => resolve(services), LATENCY_MS));
}
