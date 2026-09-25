import type { ReactNode } from 'react';

/** Page chrome; demo provider lives in SiteShell so header and page share SSR state. */
export default function PublicPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
