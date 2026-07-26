import type { ReactNode } from 'react';

import { SiteShell } from '@/components/site';

/** Public marketing/app pages — shared navbar, footer, and scene chrome. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
