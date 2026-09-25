'use client';

import { Presentation } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  readDemoModeCookieClient,
  writeDemoModeCookieClient,
} from '@/lib/demo-mode/cookies.client';
import { isDemoModeGateEnabled } from '@/lib/demo-mode/config';
import { cn } from '@/lib/utils';

type PublicPanelDemoModeToggleProps = {
  size?: 'sm' | 'md';
};

export function PublicPanelDemoModeToggle({ size = 'md' }: PublicPanelDemoModeToggleProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations('publicPanel.demo');
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readDemoModeCookieClient());
  }, [pathname]);

  if (!isDemoModeGateEnabled() || !pathname?.startsWith('/public-panel')) {
    return null;
  }

  const handleToggle = () => {
    const next = !active;
    writeDemoModeCookieClient(next);
    setActive(next);
    if (next) {
      void import('@public-panel/mock/interactive-ops-demo').then((mod) => {
        mod.resetDemoInteractiveOpsState();
      });
    }
    void queryClient.invalidateQueries();
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="toolbar"
      size="icon"
      aria-pressed={active}
      aria-label={active ? t('toggleOff') : t('toggleOn')}
      title={active ? t('toggleOff') : t('toggleOn')}
      onClick={handleToggle}
      className={cn(
        'relative rounded-full bg-app-search-category text-content hover:bg-app-search-category hover:opacity-90',
        size === 'sm' ? 'size-10' : 'size-14',
        active && 'ring-2 ring-secondary ring-offset-2 ring-offset-app-header'
      )}
    >
      <Presentation
        className={size === 'sm' ? 'size-[22px]' : 'size-7'}
        strokeWidth={1.75}
        aria-hidden
      />
    </Button>
  );
}
