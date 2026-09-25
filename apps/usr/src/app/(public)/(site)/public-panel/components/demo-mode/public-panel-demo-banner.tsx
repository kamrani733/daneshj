'use client';

import { useTranslations } from 'next-intl';

import { usePublicPanelDemoMode } from '@public-panel/components/demo-mode/public-panel-demo-provider';

export function PublicPanelDemoBanner() {
  const t = useTranslations('publicPanel.demo');
  const active = usePublicPanelDemoMode();

  if (!active) return null;

  return (
    <div
      role="status"
      className="sticky top-12 z-40 w-full border-b border-outline-variant bg-secondary-container px-4 py-2 text-center text-label-medium font-medium text-on-secondary-container lg:top-[88px]"
    >
      {t('banner')}
    </div>
  );
}
