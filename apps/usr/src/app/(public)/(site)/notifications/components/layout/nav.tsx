'use client';

import { NotificationsSidebar } from './sidebar';
import { OperationalPanelMobileMenu } from './mobile-menu';

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
