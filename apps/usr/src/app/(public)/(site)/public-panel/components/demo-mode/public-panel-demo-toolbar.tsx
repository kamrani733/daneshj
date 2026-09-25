'use client';

import { PublicPanelDemoModeToggle } from '@public-panel/components/demo-mode/public-panel-demo-toggle';
import { PublicPanelDemoPersonaSelect } from '@public-panel/components/demo-mode/public-panel-demo-persona-select';

type PublicPanelDemoToolbarProps = {
  size?: 'sm' | 'md';
};

export function PublicPanelDemoToolbar({ size = 'md' }: PublicPanelDemoToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <PublicPanelDemoPersonaSelect size={size} />
      <PublicPanelDemoModeToggle size={size} />
    </div>
  );
}
