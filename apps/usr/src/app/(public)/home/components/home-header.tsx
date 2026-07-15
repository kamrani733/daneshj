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
import { useEffect, useRef, useState } from 'react';

import { AUTH_ROUTES } from '@auth/lib/auth-routes';
import { ThemeToggle } from '@/components/theme-toggle';
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
      {/* Mobile + tablet — avatar/notif | logo (center) | search + menu; desktop from lg */}
      <div
        dir="ltr"
        className="flex h-12 items-center justify-between px-4 py-1 lg:hidden"
      >
        <HeaderIconGroup
          profileLabel={t('profile')}
          notificationsLabel={t('notifications')}
        />
        <HeaderLogo alt={t('logoAlt')} size="compact" />
        <HeaderSearchMenuGroup
          searchLabel={t('searchPlaceholder')}
          menuLabel={t('menu')}
          menuOpen={mobileOpen}
          onMenuToggle={() => setMobileOpen((open) => !open)}
        />
      </div>

      {/* Desktop — full nav from laptop widths (lg / 1024px+) */}
      <div
        dir="ltr"
        className="mx-auto hidden h-[88px] w-full max-w-[1512px] min-w-0 items-center justify-between gap-3 px-6 py-4 lg:flex min-[1280px]:gap-4 min-[1280px]:px-12"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4 min-[1280px]:gap-8">
          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle />
            <IconButton label={t('profile')} icon={UserRound} href={AUTH_ROUTES.login} />
            <NotificationButton count={3} label={t('notifications')} />
          </div>

          <label className="relative block h-14 w-full max-w-[420px] min-w-0">
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

        <nav className="flex shrink-0 items-center gap-0.5 min-[1280px]:gap-1" aria-label={t('mainNav')}>
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
          <HeaderLogo alt={t('logoAlt')} size="desktop" className="ms-1" />
        </nav>
      </div>

      {mobileOpen ? (
        <MobileNavDrawer items={NAV_LINKS} onClose={() => setMobileOpen(false)} t={t} />
      ) : null}
    </header>
  );
}

type HeaderLogoProps = {
  alt: string;
  size: 'compact' | 'desktop';
  className?: string;
};

function HeaderLogo({ alt, size, className }: HeaderLogoProps) {
  const isDesktop = size === 'desktop';

  return (
    <Link href="/" className={cn('inline-flex shrink-0', className)}>
      <Image
        src={HOME_IMAGES.logo}
        alt={alt}
        width={isDesktop ? 142 : 98}
        height={isDesktop ? 56 : 40}
        priority
        className={cn('object-contain', isDesktop ? 'h-14 w-[142px]' : 'h-10 w-[98px]')}
      />
    </Link>
  );
}

type HeaderIconGroupProps = {
  profileLabel: string;
  notificationsLabel: string;
  className?: string;
};

function HeaderIconGroup({ profileLabel, notificationsLabel, className }: HeaderIconGroupProps) {
  return (
    <div className={cn('flex shrink-0 items-center gap-2', className)}>
      <IconButton label={profileLabel} icon={UserRound} href={AUTH_ROUTES.login} size="sm" />
      <NotificationButton count={3} label={notificationsLabel} size="sm" />
    </div>
  );
}

type HeaderSearchMenuGroupProps = {
  searchLabel: string;
  menuLabel: string;
  menuOpen: boolean;
  onMenuToggle: () => void;
  className?: string;
};

/** Figma: filled 40×40 search pill + plain 40×40 menu icon, gap 10px */
function HeaderSearchMenuGroup({
  searchLabel,
  menuLabel,
  menuOpen,
  onMenuToggle,
  className,
}: HeaderSearchMenuGroupProps) {
  return (
    <div className={cn('flex shrink-0 items-center gap-2.5', className)}>
      <button
        type="button"
        aria-label={searchLabel}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-home-search-category text-content transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <Search className="size-[23px]" strokeWidth={1.75} aria-hidden />
      </button>
      <button
        type="button"
        className="inline-flex size-10 shrink-0 items-center justify-center text-content transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-expanded={menuOpen}
        aria-label={menuLabel}
        onClick={onMenuToggle}
      >
        <Menu className="size-6" strokeWidth={2} aria-hidden />
      </button>
    </div>
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
          'inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium leading-6 tracking-[0.0094em] text-content-muted transition-colors hover:bg-muted hover:text-content min-[1280px]:px-4 min-[1280px]:text-base min-[1512px]:w-[164px] min-[1512px]:px-6',
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

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const resetAndClose = () => {
    setStack([]);
    onClose();
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 top-12 z-50 flex flex-col overflow-y-auto border-t border-border bg-home-header px-4 py-3 lg:hidden"
      aria-label={t('mainNav')}
    >
      <div className="mb-3 flex shrink-0 items-center justify-between">
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

      <ul dir="rtl" className="flex min-h-0 flex-1 flex-col text-right">
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
    'inline-flex items-center justify-center rounded-full bg-home-search-category text-content transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
    size === 'sm' ? 'size-10' : 'size-14'
  );
  const iconClass = size === 'sm' ? 'size-[23px]' : 'size-8';

  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        <Icon className={iconClass} strokeWidth={1.75} />
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} className={className}>
      <Icon className={iconClass} strokeWidth={1.75} />
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
        'relative inline-flex items-center justify-center rounded-full bg-home-search-category text-content transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        size === 'sm' ? 'size-10' : 'size-14'
      )}
    >
      <Bell className={size === 'sm' ? 'size-[23px]' : 'size-8'} strokeWidth={1.75} />
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categoryWrapRef = useRef<HTMLDivElement>(null);

  const closeAll = () => {
    setCategoryOpen(false);
    setListOpen(false);
  };

  const selectCategory = (label: string) => {
    setSelectedCategory(label);
    closeAll();
  };

  return (
    <>
      <div dir="ltr" className="relative mx-auto flex h-14 w-full max-w-[572px] min-w-0">
        <label className="relative h-14 min-w-0 flex-1">
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
        <div className="relative shrink-0" ref={categoryWrapRef}>
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
              'inline-flex h-14 max-w-[160px] shrink-0 items-center gap-1 rounded-l-none rounded-r-[100px] bg-primary-subtle px-3 text-sm font-medium leading-6 tracking-[0.0094em] text-accent-foreground transition-opacity hover:opacity-90 dark:bg-primary-700 dark:text-primary-100 min-[834px]:max-w-[220px] min-[834px]:px-5 min-[834px]:text-base',
              (listOpen || categoryOpen) && 'opacity-90'
            )}
          >
            <span className="truncate">{selectedCategory ?? t('category')}</span>
            <CategoryTriggerChevron open={listOpen || categoryOpen} />
          </button>
          <CategoryMenuDropdown
            open={listOpen}
            onClose={() => setListOpen(false)}
            onSelect={selectCategory}
            containerRef={categoryWrapRef}
          />
        </div>
      </div>

      <HomeCategoryOverlay
        open={categoryOpen}
        onClose={closeAll}
        onSelect={selectCategory}
      />
    </>
  );
}
