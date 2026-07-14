'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Bell,
  ChevronLeft,
  Grid3X3,
  Headphones,
  Menu,
  Search,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { AUTH_ROUTES } from '@auth/lib/auth-routes';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { NAV_MENUS } from '../data/home-menu-data';
import type { HomeMenuItem } from '../data/home-menu-data';
import { HOME_IMAGES } from '../home-assets';
import {
  CategoryMenuDropdown,
  CategoryTriggerChevron,
  HomeCategoryOverlay,
} from './home-category-overlay';
import { HomeMenuDropdown } from './home-menu-panel';

/** Figma menu order (LTR, logo last on the right edge) */
const NAV_LINKS = [
  { key: 'contact' as const, icon: Headphones, menuKey: 'contact' as const },
  { key: 'cooperation' as const, icon: Users, menuKey: 'cooperation' as const },
  { key: 'services' as const, icon: Grid3X3, menuKey: 'services' as const },
];

export function HomeHeader() {
  const t = useTranslations('home.header');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);

  const closeNav = () => setOpenNav(null);

  return (
    <header className="sticky top-0 z-50 bg-home-header shadow-home-elevation-1">
      {/* Desktop / tablet — Figma Top Navigation Bar #28:1410 */}
      <div
        dir="ltr"
        className="mx-auto hidden h-[88px] w-full max-w-[1512px] items-center justify-between px-4 py-4 min-[834px]:flex min-[834px]:px-12"
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <IconButton label={t('profile')} icon={UserRound} href={AUTH_ROUTES.login} />
            <NotificationButton count={3} label={t('notifications')} />
          </div>

          <label className="relative block h-14 w-[420px] shrink-0">
            <span className="sr-only">{t('searchPlaceholder')}</span>
            <Search
              className="pointer-events-none absolute right-4 top-1/2 size-6 -translate-y-1/2 text-content-muted"
              aria-hidden
            />
            <input
              type="search"
              dir="rtl"
              placeholder={t('searchPlaceholder')}
              className="h-14 w-full rounded-[28px] border border-border bg-home-search-fill pe-12 ps-5 text-end text-base leading-6 tracking-[0.0094em] text-content outline-none placeholder:text-content-muted focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </label>
        </div>

        <nav className="flex items-center gap-1" aria-label={t('mainNav')}>
          {NAV_LINKS.map(({ key, icon: Icon, menuKey }) => (
            <NavMenuItem
              key={key}
              label={t(key)}
              icon={Icon}
              open={openNav === key}
              onToggle={() => setOpenNav((current) => (current === key ? null : key))}
              onClose={closeNav}
              items={NAV_MENUS[menuKey]}
            />
          ))}
          <Link href="/" className="ms-1 shrink-0">
            <Image
              src={HOME_IMAGES.logo}
              alt={t('logoAlt')}
              width={142}
              height={56}
              priority
              className="h-14 w-[142px] object-contain"
            />
          </Link>
        </nav>
      </div>

      {/* Mobile — Figma Mobile Header */}
      <div dir="ltr" className="flex items-center justify-between px-4 py-1 min-[834px]:hidden">
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
            className="h-12 w-[120px] object-contain"
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
        <MobileNavDrawer items={NAV_LINKS} onClose={() => setMobileOpen(false)} t={t} />
      ) : null}
    </header>
  );
}

type NavMenuItemProps = {
  label: string;
  icon: typeof Grid3X3;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  items: HomeMenuItem[];
};

function NavMenuItem({ label, icon: Icon, open, onToggle, onClose, items }: NavMenuItemProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        dir="rtl"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={onToggle}
        className={cn(
          'inline-flex h-12 w-[164px] items-center justify-center gap-2 rounded-full px-6 text-base font-medium leading-6 tracking-[0.0094em] text-content-muted transition-colors hover:bg-muted hover:text-content',
          open && 'bg-muted text-content'
        )}
      >
        <span>{label}</span>
        <Icon className="size-5 shrink-0" aria-hidden />
      </button>
      <HomeMenuDropdown open={open} onClose={onClose} items={items} containerRef={wrapRef} />
    </div>
  );
}

type MobileNavDrawerProps = {
  items: typeof NAV_LINKS;
  onClose: () => void;
  t: ReturnType<typeof useTranslations<'home.header'>>;
};

function MobileNavDrawer({ items, onClose, t }: MobileNavDrawerProps) {
  const [stack, setStack] = useState<{ title: string; items: HomeMenuItem[] }[]>([]);
  const current = stack[stack.length - 1];

  const resetAndClose = () => {
    setStack([]);
    onClose();
  };

  return (
    <nav
      className="border-t border-border bg-home-header px-4 py-3 min-[834px]:hidden"
      aria-label={t('mainNav')}
    >
      <div className="mb-3 flex items-center justify-between">
        {current ? (
          <button
            type="button"
            dir="rtl"
            onClick={() => setStack((value) => value.slice(0, -1))}
            className="inline-flex items-center gap-2 text-right text-sm font-medium text-content"
          >
            <ChevronLeft className="size-5" />
            <span>{current.title}</span>
          </button>
        ) : (
          <span dir="rtl" className="text-right text-sm font-medium text-content-muted">
            {t('mainNav')}
          </span>
        )}
        <button
          type="button"
          aria-label="بستن منو"
          onClick={resetAndClose}
          className="inline-flex size-9 items-center justify-center rounded-full hover:bg-muted"
        >
          <X className="size-5" />
        </button>
      </div>

      <ul dir="rtl" className="flex flex-col text-right">
        {(current?.items ?? items.map(({ key, menuKey }) => ({
          id: key,
          label: t(key),
          children: NAV_MENUS[menuKey],
        }))).map((item) => (
          <li key={item.id}>
            <button
              type="button"
              dir="rtl"
              className="flex h-14 w-full items-center justify-between gap-2 border-b border-border/60 px-2 text-right text-base font-medium text-content"
              onClick={() => {
                if (item.children?.length) {
                  setStack((value) => [...value, { title: item.label, items: item.children! }]);
                  return;
                }
                resetAndClose();
              }}
            >
              <span>{item.label}</span>
              {item.children?.length ? (
                <ChevronLeft className="size-5 text-content-muted" aria-hidden />
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </nav>
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
    'inline-flex items-center justify-center rounded-full bg-home-search-category text-content transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
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
        'relative inline-flex items-center justify-center rounded-full bg-home-search-category text-content transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        size === 'sm' ? 'size-10' : 'size-14'
      )}
    >
      <Bell className={size === 'sm' ? 'size-5' : 'size-8'} />
      {count > 0 ? (
        <span className="absolute -left-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-medium leading-4 tracking-[0.0091em] text-primary-foreground">
          {count}
        </span>
      ) : null}
    </button>
  );
}

/** Figma Search box + category #1:9073 — 572×56, search left-rounded, category right-rounded */
export function HomeSearchCategoryBar() {
  const t = useTranslations('home.search');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const categoryWrapRef = useRef<HTMLDivElement>(null);

  const closeAll = () => {
    setCategoryOpen(false);
    setListOpen(false);
  };

  return (
    <>
      <div dir="ltr" className="relative mx-auto flex h-14 w-full max-w-[572px]">
        <label className="relative h-14 w-[420px] shrink-0">
          <span className="sr-only">{t('placeholder')}</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-content-muted"
            aria-hidden
          />
          <input
            type="search"
            dir="rtl"
            placeholder={t('placeholder')}
            className="h-14 w-full rounded-l-[28px] rounded-r-none border border-border bg-home-search-category pl-12 pr-5 text-end text-base leading-6 tracking-[0.0094em] text-content outline-none placeholder:text-content-muted focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </label>
        <div className="relative" ref={categoryWrapRef}>
          <button
            type="button"
            dir="rtl"
            aria-expanded={listOpen || categoryOpen}
            aria-haspopup="menu"
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 834) {
                setCategoryOpen(true);
                setListOpen(false);
                return;
              }
              setListOpen((open) => !open);
              setCategoryOpen(false);
            }}
            className={cn(
              'inline-flex h-14 shrink-0 items-center gap-1 rounded-l-none rounded-r-[100px] bg-primary-subtle px-5 text-base font-medium leading-6 tracking-[0.0094em] text-accent-foreground transition-opacity hover:opacity-90',
              (listOpen || categoryOpen) && 'opacity-90'
            )}
          >
            <span>{t('category')}</span>
            <CategoryTriggerChevron open={listOpen || categoryOpen} />
          </button>
          <CategoryMenuDropdown
            open={listOpen}
            onClose={() => setListOpen(false)}
            containerRef={categoryWrapRef}
          />
        </div>
      </div>

      <HomeCategoryOverlay open={categoryOpen} onClose={closeAll} />
    </>
  );
}
