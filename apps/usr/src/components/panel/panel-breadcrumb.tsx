import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type PanelBreadcrumbProps = {
  label: string;
  current: string;
  account: string;
  home: string;
  homeHref?: string;
};

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
      <span className="font-semibold leading-5 tracking-[0.0071em] text-app-filter-muted dark:text-app-filter-ink">
        {current}
      </span>
      <ChevronLeft
        className="size-4 shrink-0 text-neutral-600 dark:text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden
      />
      <span className="font-medium leading-5 tracking-[0.0071em] text-neutral-600 dark:text-muted-foreground">
        {account}
      </span>
      <ChevronLeft
        className="size-4 shrink-0 text-neutral-600 dark:text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden
      />
      <Link
        href={homeHref}
        className="font-medium leading-5 tracking-[0.0071em] text-neutral-600 hover:text-primary dark:text-muted-foreground dark:hover:text-primary-100"
      >
        {home}
      </Link>
    </nav>
  );
}
