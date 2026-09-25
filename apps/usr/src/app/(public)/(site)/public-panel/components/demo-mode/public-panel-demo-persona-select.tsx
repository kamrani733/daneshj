'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { isDemoModeGateEnabled } from '@/lib/demo-mode/config';
import {
  DEMO_PERSONA_IDS,
  type DemoPersonaId,
} from '@/lib/demo-mode/persona';
import { readDemoPersonaCookieClient } from '@/lib/demo-mode/persona-cookies.client';
import { cn } from '@/lib/utils';

import {
  usePublicPanelDemoMode,
  usePublicPanelDemoModeActions,
} from '@public-panel/components/demo-mode/public-panel-demo-provider';

type PublicPanelDemoPersonaSelectProps = {
  size?: 'sm' | 'md';
};

export function PublicPanelDemoPersonaSelect({
  size = 'md',
}: PublicPanelDemoPersonaSelectProps) {
  const pathname = usePathname();
  const t = useTranslations('publicPanel.demo');
  const demoActive = usePublicPanelDemoMode();
  const { setPersona } = usePublicPanelDemoModeActions();
  const [value, setValue] = useState<DemoPersonaId>(() =>
    readDemoPersonaCookieClient()
  );

  useEffect(() => {
    setValue(readDemoPersonaCookieClient());
  }, [pathname, demoActive]);

  if (
    !isDemoModeGateEnabled() ||
    !pathname?.startsWith('/public-panel') ||
    !demoActive
  ) {
    return null;
  }

  return (
    <label
      className={cn(
        'inline-flex max-w-[min(100vw-8rem,220px)] items-center gap-2 rounded-full bg-app-search-category px-3 text-app-filter-ink',
        size === 'sm' ? 'h-10 text-xs' : 'h-11 text-sm'
      )}
    >
      <span className="shrink-0 font-medium text-app-filter-muted">
        {t('personaLabel')}
      </span>
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value as DemoPersonaId;
          setValue(next);
          setPersona(next);
        }}
        className={cn(
          'min-w-0 flex-1 appearance-none bg-transparent font-semibold text-app-filter-ink',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md'
        )}
        aria-label={t('personaLabel')}
      >
        {DEMO_PERSONA_IDS.map((id) => (
          <option key={id} value={id}>
            {t(`personas.${id}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
