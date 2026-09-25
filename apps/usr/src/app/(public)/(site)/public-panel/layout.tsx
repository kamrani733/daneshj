import type { ReactNode } from 'react';

import { readDemoModeCookieServer } from '@/lib/demo-mode/cookies.server';
import { readDemoPersonaCookieServer } from '@/lib/demo-mode/persona-cookies.server';
import { PublicPanelDemoProvider } from '@public-panel/components/demo-mode/public-panel-demo-provider';

export default async function PublicPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const initialActive = await readDemoModeCookieServer();
  const initialPersona = await readDemoPersonaCookieServer();

  return (
    <PublicPanelDemoProvider
      initialActive={initialActive}
      initialPersona={initialPersona}
    >
      {children}
    </PublicPanelDemoProvider>
  );
}
