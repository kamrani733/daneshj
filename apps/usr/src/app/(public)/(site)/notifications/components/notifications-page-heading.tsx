import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

/** Figma Title part #2392:4851 — breadcrumb + orange bar + title (right-aligned). */
export function NotificationsPageHeading() {
  const t = useTranslations('notifications');

  return (
    <header className="flex w-full flex-col items-start gap-6">
      <nav
        aria-label={t('breadcrumb.label')}
        className="flex items-center gap-2 text-sm"
      >
        <span className="font-semibold leading-5 tracking-[0.0071em] text-green-700">
          {t('breadcrumb.current')}
        </span>
        <ChevronLeft
          className="size-5 shrink-0 text-neutral-600"
          strokeWidth={1.5}
          aria-hidden
        />
        <Link
          href="/"
          className="font-medium leading-5 tracking-[0.0071em] text-neutral-600 hover:text-green-700"
        >
          {t('breadcrumb.home')}
        </Link>
      </nav>

      <div className="flex items-center gap-2 px-2">
        <span
          aria-hidden
          className="inline-block h-8 w-2 shrink-0 rounded-[2px] bg-warning-400"
        />
        <h1 className="text-[32px] font-bold leading-10 text-primary-700">
          {t('title')}
        </h1>
      </div>
    </header>
  );
}
