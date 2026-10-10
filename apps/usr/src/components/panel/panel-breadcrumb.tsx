import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type PanelBreadcrumbProps = {
  label: string;
  current: string;
  account: string;
  home: string;
  homeHref?: string;
  /** Phones show only the current page (private/public panel export); `false` keeps the full path. */
  collapseOnPhone?: boolean;
};

/** «خانه › حساب کاربری › current» — home first, so it sits at the start (right) in RTL. */
export function PanelBreadcrumb({
  label,
  current,
  account,
  home,
  homeHref = '/',
  collapseOnPhone = true,
}: PanelBreadcrumbProps) {
  // Literal class names so Tailwind generates them.
  const inlineFromTablet = collapseOnPhone ? 'hidden min-[720px]:inline' : 'inline';
  const blockFromTablet = collapseOnPhone ? 'hidden min-[720px]:block' : 'block';
  return (
    <nav
      dir="rtl"
      aria-label={label}
      className="flex flex-wrap items-center justify-start gap-2 text-sm"
    >
      <Link
        href={homeHref}
        className={`${inlineFromTablet} font-medium leading-5 tracking-[0.0071em] text-neutral-600 hover:text-primary dark:text-muted-foreground dark:hover:text-primary-100`}
      >
        {home}
      </Link>
      <ChevronLeft
        className={`${blockFromTablet} size-4 shrink-0 text-neutral-600 dark:text-muted-foreground`}
        strokeWidth={1.5}
        aria-hidden
      />
      <span className={`${inlineFromTablet} font-medium leading-5 tracking-[0.0071em] text-neutral-600 dark:text-muted-foreground`}>
        {account}
      </span>
      <ChevronLeft
        className={`${blockFromTablet} size-4 shrink-0 text-neutral-600 dark:text-muted-foreground`}
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
