'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Bell,
  ChevronDown,
  Grid3X3,
  Headphones,
  Menu,
  Search,
  UserRound,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { AUTH_ROUTES } from '@auth/lib/auth-routes';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { HOME_IMAGES } from '../home-assets';

const NAV_LINKS = [
  { key: 'cooperation', icon: Users },
  { key: 'services', icon: Grid3X3 },
  { key: 'contact', icon: Headphones },
] as const;

export function HomeHeader() {
  const t = useTranslations('home.header');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-home-header shadow-home-elevation-1">
      {/* Desktop / tablet — Figma Top Navigation Bar: padding 16px 48px */}
      <div className="mx-auto hidden w-full max-w-[1512px] items-center justify-between gap-8 px-6 py-4 min-[834px]:flex min-[834px]:px-12 min-[1512px]:px-12">
        {/* Logo + nav — start (right in RTL) */}
        <nav className="flex items-center gap-1" aria-label={t('mainNav')}>
          <Link href="/" className="me-2 shrink-0">
            <Image
              src={HOME_IMAGES.logo}
              alt={t('logoAlt')}
              width={142}
              height={56}
              priority
              className="h-14 w-[142px] object-contain object-right"
            />
          </Link>
          {NAV_LINKS.map(({ key, icon: Icon }) => (
            <Link
              key={key}
              href="#"
              className="inline-flex h-12 min-w-[164px] items-center justify-center gap-2 rounded-full px-4 text-base font-medium leading-6 tracking-[0.0094em] text-content transition-colors hover:bg-muted"
            >
              <span>{t(key)}</span>
              <Icon className="size-5 shrink-0" aria-hidden />
            </Link>
          ))}
        </nav>

        {/* Actions + search — end (left in RTL) */}
        <div className="flex items-center gap-8">
          <label className="relative hidden w-[420px] min-[834px]:block">
            <span className="sr-only">{t('searchPlaceholder')}</span>
            <Search
              className="pointer-events-none absolute start-4 top-1/2 size-6 -translate-y-1/2 text-content-muted"
              aria-hidden
            />
            <input
              type="search"
              dir="rtl"
              placeholder={t('searchPlaceholder')}
              className="h-14 w-full rounded-[28px] border border-border bg-home-search-fill pe-12 ps-4 text-end text-base leading-6 tracking-[0.0094em] text-content outline-none placeholder:text-content-muted focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </label>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <IconButton label={t('profile')} icon={UserRound} href={AUTH_ROUTES.login} />
            <NotificationButton count={3} label={t('notifications')} />
          </div>
        </div>
      </div>

      {/* Mobile — Figma: actions (start/right) | logo (center) | menu (end/left) */}
      <div className="flex items-center justify-between gap-3 px-4 py-1 min-[834px]:hidden">
        <div className="flex items-center gap-2">
          <IconButton label={t('profile')} icon={UserRound} href={AUTH_ROUTES.login} size="sm" />
          <NotificationButton count={3} label={t('notifications')} size="sm" />
        </div>

        <Link href="/" className="shrink-0">
          <Image
            src={HOME_IMAGES.logo}
            alt={t('logoAlt')}
            width={120}
            height={48}
            priority
            className="h-12 w-[120px] object-contain object-right"
          />
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 rounded-full"
          aria-expanded={mobileOpen}
          aria-label={t('menu')}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <Menu className="size-6" />
        </Button>
      </div>

      {mobileOpen ? (
        <nav
          className="border-t border-border bg-home-header px-4 py-3 min-[834px]:hidden"
          aria-label={t('mainNav')}
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ key, icon: Icon }) => (
              <li key={key}>
                <Link
                  href="#"
                  className="flex items-center justify-end gap-2 rounded-lg px-3 py-3 text-base font-medium text-content"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{t(key)}</span>
                  <Icon className="size-5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

type IconButtonProps = {
  label: string;
  icon: typeof UserRound;
  href?: string;
  size?: 'sm' | 'md';
};

function IconButton({ label, icon: Icon, href, size = 'md' }: IconButtonProps) {
  const className = cn(
    'inline-flex items-center justify-center rounded-full text-content transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
    size === 'sm' ? 'size-10' : 'size-14'
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        <Icon className={size === 'sm' ? 'size-5' : 'size-8'} />
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} className={className}>
      <Icon className={size === 'sm' ? 'size-5' : 'size-8'} />
    </button>
  );
}

type NotificationButtonProps = {
  count: number;
  label: string;
  size?: 'sm' | 'md';
};

function NotificationButton({ count, label, size = 'md' }: NotificationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full text-content transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        size === 'sm' ? 'size-10' : 'size-14'
      )}
    >
      <Bell className={size === 'sm' ? 'size-5' : 'size-8'} />
      {count > 0 ? (
        <span className="absolute -top-0.5 start-0 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-medium leading-4 tracking-[0.0091em] text-primary-foreground">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function HomeSearchCategoryBar() {
  const t = useTranslations('home.search');

  return (
    <div className="mx-auto flex w-full max-w-[572px] justify-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">{t('placeholder')}</span>
        <Search
          className="pointer-events-none absolute start-4 top-1/2 size-6 -translate-y-1/2 text-content-muted"
          aria-hidden
        />
        <input
          type="search"
          dir="rtl"
          placeholder={t('placeholder')}
          className="h-14 w-full rounded-s-[28px] border border-border bg-home-search-category pe-12 ps-4 text-end text-base leading-6 tracking-[0.0094em] text-content outline-none placeholder:text-content-muted focus-visible:ring-2 focus-visible:ring-primary/30"
        />
      </label>
      <button
        type="button"
        className="inline-flex h-14 shrink-0 items-center gap-1 rounded-e-[100px] bg-primary-subtle px-5 text-base font-medium leading-6 tracking-[0.0094em] text-accent-foreground transition-opacity hover:opacity-90"
      >
        <span>{t('category')}</span>
        <ChevronDown className="size-5" aria-hidden />
      </button>
    </div>
  );
}
