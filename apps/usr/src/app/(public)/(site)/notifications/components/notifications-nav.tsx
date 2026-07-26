'use client';

import { NotificationsSidebar } from './notifications-sidebar';
import { OperationalPanelMobileMenu } from './operational-panel-mobile-menu';

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
