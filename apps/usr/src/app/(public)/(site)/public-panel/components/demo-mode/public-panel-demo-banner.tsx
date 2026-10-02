'use client';

import { useTranslations } from 'next-intl';

import { usePublicPanelDemoMode } from '@public-panel/components/demo-mode/public-panel-demo-provider';
import { PublicPanelDemoPersonaSelect } from '@public-panel/components/demo-mode/public-panel-demo-persona-select';
import { PublicPanelDemoModeToggle } from '@public-panel/components/demo-mode/public-panel-demo-toggle';

export function PublicPanelDemoBanner() {
  const t = useTranslations('publicPanel.demo');
  const active = usePublicPanelDemoMode();

  if (!active) return null;

  return (
    <div
      role="status"
      className="sticky top-12 z-40 w-full border-b border-outline-variant bg-secondary-container px-4 py-2 text-center text-label-medium font-medium text-on-secondary-container lg:top-[88px]"
    >
      <p>{t('banner')}</p>
      <div className="mt-2 flex items-center justify-center gap-2 min-[720px]:hidden">
        <PublicPanelDemoPersonaSelect size="md" />
        <PublicPanelDemoModeToggle size="sm" />
      </div>
    </div>
  );
}
