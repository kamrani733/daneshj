'use client';

import { cn } from '@/lib/utils';

import { PublicPanelDemoModeToggle } from '@public-panel/components/demo-mode/public-panel-demo-toggle';
import { PublicPanelDemoPersonaSelect } from '@public-panel/components/demo-mode/public-panel-demo-persona-select';
import { usePublicPanelDemoMode } from '@public-panel/components/demo-mode/public-panel-demo-provider';

type PublicPanelDemoToolbarProps = {
  size?: 'sm' | 'md';
};

export function PublicPanelDemoToolbar({ size = 'md' }: PublicPanelDemoToolbarProps) {
  const active = usePublicPanelDemoMode();
  // Phones (< 720) while demo is on: controls move to the demo banner so the
  // header keeps logo + menu. While off, the header keeps the toggle to turn it on.
  const hideOnPhone = size === 'sm' && active;

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        hideOnPhone && 'hidden min-[720px]:flex'
      )}
    >
      <PublicPanelDemoPersonaSelect size={size} />
      <PublicPanelDemoModeToggle size={size} />
    </div>
  );
}
