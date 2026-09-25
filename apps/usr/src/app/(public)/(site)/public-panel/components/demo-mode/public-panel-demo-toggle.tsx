'use client';

import { Presentation } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { isDemoModeGateEnabled } from '@/lib/demo-mode/config';
import { cn } from '@/lib/utils';

import {
  usePublicPanelDemoMode,
  usePublicPanelDemoModeActions,
} from '@public-panel/components/demo-mode/public-panel-demo-provider';

type PublicPanelDemoModeToggleProps = {
  size?: 'sm' | 'md';
};

export function PublicPanelDemoModeToggle({ size = 'md' }: PublicPanelDemoModeToggleProps) {
  const pathname = usePathname();
  const t = useTranslations('publicPanel.demo');
  const active = usePublicPanelDemoMode();
  const { setDemoMode } = usePublicPanelDemoModeActions();

  if (!isDemoModeGateEnabled() || !pathname?.startsWith('/public-panel')) {
    return null;
  }

  const handleToggle = () => {
    setDemoMode(!active);
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
