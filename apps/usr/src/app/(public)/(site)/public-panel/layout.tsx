import type { ReactNode } from 'react';

import { readDemoModeCookieServer } from '@/lib/demo-mode/cookies.server';
import { PublicPanelDemoProvider } from '@public-panel/components/demo-mode/public-panel-demo-provider';

export default async function PublicPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const initialActive = await readDemoModeCookieServer();

  return (
    <PublicPanelDemoProvider initialActive={initialActive}>
      {children}
    </PublicPanelDemoProvider>
  );
}
