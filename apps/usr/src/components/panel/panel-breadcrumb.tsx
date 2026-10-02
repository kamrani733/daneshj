import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type PanelBreadcrumbProps = {
  label: string;
  current: string;
  account: string;
  home: string;
  homeHref?: string;
};

/** «خانه › حساب کاربری › current» — home first, so it sits at the start (right) in RTL. */
export function PanelBreadcrumb({
  label,
  current,
  account,
  home,
  homeHref = '/',
}: PanelBreadcrumbProps) {
  return (
    <nav
      dir="rtl"
      aria-label={label}
      className="flex flex-wrap items-center justify-start gap-2 text-sm"
    >
      {/* Phones show the current page only (responsive export). */}
      <Link
        href={homeHref}
        className="hidden font-medium min-[720px]:inline leading-5 tracking-[0.0071em] text-neutral-600 hover:text-primary dark:text-muted-foreground dark:hover:text-primary-100"
      >
        {home}
      </Link>
      <ChevronLeft
        className="hidden size-4 shrink-0 text-neutral-600 min-[720px]:block dark:text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden
      />
      <span className="hidden font-medium leading-5 tracking-[0.0071em] text-neutral-600 min-[720px]:inline dark:text-muted-foreground">
        {account}
      </span>
      <ChevronLeft
        className="hidden size-4 shrink-0 text-neutral-600 min-[720px]:block dark:text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden
      />
      <span
        aria-current="page"
        className="font-semibold leading-5 tracking-[0.0071em] text-app-filter-muted dark:text-app-filter-ink"
      >
        {current}
      </span>
    </nav>
  );
}
