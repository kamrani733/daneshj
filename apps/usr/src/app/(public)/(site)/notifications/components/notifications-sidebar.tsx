import Link from 'next/link';
import {
  Bell,
  ChartColumn,
  ChartNoAxesColumn,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { NOTIFICATIONS_PATH } from '@home/data/notifications-mock';
import { cn } from '@/lib/utils';

const ITEMS: Array<{
  key: 'received' | 'reports' | 'stats' | 'charts';
  href: string;
  icon: LucideIcon;
  active?: boolean;
}> = [
  { key: 'received', href: NOTIFICATIONS_PATH, icon: Bell, active: true },
  { key: 'reports', href: '#', icon: ClipboardList },
  { key: 'stats', href: '#', icon: ChartColumn },
  { key: 'charts', href: '#', icon: ChartNoAxesColumn },
];

/** Figma Navigation Drawer #2392:4854 */
export function NotificationsSidebar() {
  const t = useTranslations('notifications.sidebar');

  return (
    <aside
      className={cn(
        'w-full shrink-0 rounded-lg border border-green-400/60 bg-white p-3',
        'shadow-[-3px_3px_8px_0_rgba(0,0,0,0.1),1px_0_8px_-2px_rgba(0,0,0,0.1)]',
        'min-[720px]:w-[260px] min-[1000px]:w-[300px] min-[1200px]:w-[360px]'
      )}
    >
      <nav aria-label={t('navLabel')} className="flex w-full flex-col">
        {ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex w-full flex-col">
              {index > 0 ? (
                <div aria-hidden className="mx-4 h-px bg-green-400/50" />
              ) : null}
              <Link
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={cn(
                  'flex h-14 w-full items-center gap-3 px-4 text-sm leading-5 tracking-[0.0071em]',
                  item.active
                    ? 'rounded-e-[50px] rounded-s-lg border-s-[2px] border-primary bg-primary-subtle font-bold text-primary'
                    : 'font-medium text-green-700 hover:bg-black/5'
                )}
              >
                <Icon className="size-6 shrink-0" strokeWidth={1.5} aria-hidden />
                <span>{t(item.key)}</span>
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
