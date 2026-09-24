'use client';

import { NotificationsSidebar } from '@notifications/components/layout/sidebar';
import { OperationalPanelMobileMenu } from '@notifications/components/layout/mobile-menu';

/**
 * Responsive operational-panel navigation:
 * mobile bottom-sheet trigger · desktop sidebar.
 */
export function NotificationsNav() {
  return (
    <>
      <OperationalPanelMobileMenu />
      <NotificationsSidebar />
    </>
  );
}
