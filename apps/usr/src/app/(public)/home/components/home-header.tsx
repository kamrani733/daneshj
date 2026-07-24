'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Bell,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { NAV_MENUS } from '../data/home-menu-data';
import type { HomeMenuItem } from '../data/home-menu-data';
import { HOME_IMAGES } from '../home-assets';
import {
  CategoryMenuDropdown,
  CategoryTriggerChevron,
  HomeCategoryOverlay,
} from './home-category-overlay';
import { HomeMenuDropdown, HomeMenuStackList } from './home-menu-panel';
import { UserProfileMenu } from './user-profile-menu';

/** Figma menu order (LTR, logo last on the right edge) */
type NavLink =
  | {
      key: 'contact' | 'services';
      icon: typeof Headphones;
      menuKey: 'contact' | 'services';
      href?: never;
    }
  | {
      key: 'cooperation';
      icon: typeof Users;
      href: string;
      menuKey?: never;
    };

const NAV_LINKS: NavLink[] = [
  { key: 'contact', icon: Headphones, menuKey: 'contact' },
  { key: 'cooperation', icon: Users, href: '/cooperation' },
  { key: 'services', icon: Grid3X3, menuKey: 'services' },
];

type HomeHeaderProps = {
  isAuthenticated?: boolean;
  userName?: string;
};

export function HomeHeader({ isAuthenticated = false, userName }: HomeHeaderProps) {
  const t = useTranslations('home.header');
  const tHome = useTranslations('home');
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
          isAuthenticated={isAuthenticated}
          userName={userName}
          profileLabel={t('profile')}
          loginLabel={tHome('login')}
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
            <AuthEntryButton
              isAuthenticated={isAuthenticated}
              userName={userName}
              profileLabel={t('profile')}
              loginLabel={tHome('login')}
            />
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
          {NAV_LINKS.map((link) =>
            link.menuKey ? (
              <NavMenuItem
                key={link.key}
                label={t(link.key)}
                icon={link.icon}
                open={openNav === link.key}
                onToggle={() =>
                  setOpenNav((current) => (current === link.key ? null : link.key))
                }
                onClose={closeNav}
                items={NAV_MENUS[link.menuKey]}
              />
            ) : (
              <NavDirectLink
                key={link.key}
                label={t(link.key)}
                icon={link.icon}
                href={link.href}
              />
            )
          )}
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
  isAuthenticated: boolean;
  userName?: string;
  profileLabel: string;
  loginLabel: string;
  notificationsLabel: string;
  className?: string;
};

function HeaderIconGroup({
  isAuthenticated,
  userName,
  profileLabel,
  loginLabel,
  notificationsLabel,
  className,
}: HeaderIconGroupProps) {
  return (
    <div className={cn('flex shrink-0 items-center gap-2', className)}>
      <AuthEntryButton
        isAuthenticated={isAuthenticated}
        userName={userName}
        profileLabel={profileLabel}
        loginLabel={loginLabel}
        size="sm"
      />
      <NotificationButton count={3} label={notificationsLabel} size="sm" />
    </div>
  );
}

type AuthEntryButtonProps = {
  isAuthenticated: boolean;
  profileLabel: string;
  loginLabel: string;
  userName?: string;
  size?: 'sm' | 'md';
};

function AuthEntryButton({
  isAuthenticated,
  profileLabel,
  loginLabel,
  userName,
  size = 'md',
}: AuthEntryButtonProps) {
  if (!isAuthenticated) {
    return (
      <Link
        href={AUTH_ROUTES.login}
        className={cn(
          'inline-flex items-center justify-center rounded-md border border-primary bg-primary px-4 font-medium text-primary-foreground transition-colors',
          'hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          size === 'sm' ? 'h-9 text-sm' : 'h-11 text-base'
        )}
      >
        {loginLabel}
      </Link>
    );
  }

  return (
    <UserProfileMenu
      displayName={userName?.trim() || 'نام و نام خانوادگی'}
      triggerLabel={profileLabel}
      trigger={({ open, menuId, onToggle }) => (
        <IconButton
          label={profileLabel}
          icon={UserRound}
          size={size}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={open ? menuId : undefined}
          onClick={onToggle}
        />
      )}
    />
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
      <Button
        type="button"
        variant="toolbar"
        size="icon"
        aria-label={searchLabel}
        className="size-10 shrink-0 rounded-full bg-home-search-category text-content hover:bg-home-search-category hover:opacity-90"
      >
        <Search className="size-[23px]" strokeWidth={1.75} aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-10 shrink-0 text-content hover:bg-transparent hover:opacity-80"
        aria-expanded={menuOpen}
        aria-label={menuLabel}
        onClick={onMenuToggle}
      >
        <Menu className="size-6" strokeWidth={2} aria-hidden />
      </Button>
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

function NavDirectLink({
  label,
  icon: Icon,
  href,
}: {
  label: string;
  icon: typeof Grid3X3;
  href: string;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      size="none"
      className="h-12 min-w-0 gap-2 rounded-full px-3 text-sm font-medium leading-6 tracking-[0.0094em] text-content-muted hover:bg-muted hover:text-content min-[1280px]:px-4 min-[1280px]:text-base min-[1512px]:w-[164px] min-[1512px]:px-6"
    >
      <Link href={href} dir="rtl" className="inline-flex items-center gap-2">
        <span>{label}</span>
        <Icon className="size-5 shrink-0" aria-hidden />
      </Link>
    </Button>
  );
}

function NavMenuItem({ label, icon: Icon, open, onToggle, onClose, items }: NavMenuItemProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="none"
        dir="rtl"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={onToggle}
        className={cn(
          'h-12 min-w-0 gap-2 rounded-full px-3 text-sm font-medium leading-6 tracking-[0.0094em] text-content-muted hover:bg-muted hover:text-content min-[1280px]:px-4 min-[1280px]:text-base min-[1512px]:w-[164px] min-[1512px]:px-6',
          open && 'bg-muted text-content'
        )}
      >
        <span>{label}</span>
        <Icon className="size-5 shrink-0" aria-hidden />
      </Button>
      <HomeMenuDropdown open={open} onClose={onClose} items={items} containerRef={wrapRef} />
    </div>
  );
}

type MobileNavDrawerProps = {
  items: NavLink[];
  onClose: () => void;
  t: ReturnType<typeof useTranslations<'home.header'>>;
};

function MobileNavDrawer({ items, onClose, t }: MobileNavDrawerProps) {
  const rootItems: HomeMenuItem[] = items.map((link) => ({
    id: link.key,
    label: t(link.key),
    icon: link.icon,
    href: link.href,
    children: link.menuKey ? NAV_MENUS[link.menuKey] : undefined,
  }));

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex h-[100dvh] w-screen flex-col bg-home-header lg:hidden">
      <button
        type="button"
        aria-label="بستن منو"
        onClick={onClose}
        className="absolute left-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-home-search-category text-content transition-colors hover:bg-muted"
      >
        <X className="size-5" />
      </button>

      <nav
        dir="rtl"
        className="flex size-full min-h-0 flex-1 flex-col"
        aria-label={t('mainNav')}
      >
        <HomeMenuStackList
          items={rootItems}
          expandNested
          className="min-h-0 w-full flex-1 pt-16"
          listClassName="!max-h-none h-full min-h-0 flex-1 rounded-none shadow-none"
          onNavigate={() => onClose()}
        />
      </nav>
    </div>
  );
}

type IconButtonProps = {
  label: string;
  icon: typeof UserRound;
  href?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'menu' | boolean;
  'aria-controls'?: string;
};

function IconButton({
  label,
  icon: Icon,
  href,
  size = 'md',
  onClick,
  'aria-expanded': ariaExpanded,
  'aria-haspopup': ariaHaspopup,
  'aria-controls': ariaControls,
}: IconButtonProps) {
  const className = cn(
    'rounded-full bg-home-search-category text-content hover:bg-home-search-category hover:opacity-90',
    size === 'sm' ? 'size-10' : 'size-14'
  );
  const iconClass = size === 'sm' ? 'size-[23px]' : 'size-8';

  if (href) {
    return (
      <Button asChild variant="toolbar" size="icon" className={className}>
        <Link href={href} aria-label={label}>
          <Icon className={iconClass} strokeWidth={1.75} />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="toolbar"
      size="icon"
      aria-label={label}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      aria-controls={ariaControls}
      onClick={onClick}
      className={className}
    >
      <Icon className={iconClass} strokeWidth={1.75} />
    </Button>
  );
}

type NotificationButtonProps = {
  count: number;
  label: string;
  size?: 'sm' | 'md';
};

function NotificationButton({ count, label, size = 'md' }: NotificationButtonProps) {
  return (
    <Button
      type="button"
      variant="toolbar"
      size="icon"
      aria-label={label}
      className={cn(
        'relative rounded-full bg-home-search-category text-content hover:bg-home-search-category hover:opacity-90',
        size === 'sm' ? 'size-10' : 'size-14'
      )}
    >
      <Bell className={size === 'sm' ? 'size-[23px]' : 'size-8'} strokeWidth={1.75} />
      {count > 0 ? (
        <span className="absolute -left-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-medium leading-4 tracking-[0.0091em] text-primary-foreground">
          {count}
        </span>
      ) : null}
    </Button>
  );
}

type HomeSearchCategoryBarProps = {
  onSearch?: (search: { query: string; category: string | null }) => void;
  onClearSearch?: () => void;
};

/** Figma Search box + category #1:9073 — 572×56, search left-rounded, category right-rounded */
export function HomeSearchCategoryBar({
  onSearch,
  onClearSearch,
}: HomeSearchCategoryBarProps) {
  const t = useTranslations('home.search');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const categoryWrapRef = useRef<HTMLDivElement>(null);

  const closeAll = () => {
    setCategoryOpen(false);
    setListOpen(false);
  };

  const emitSearch = (nextQuery: string, nextCategory: string | null) => {
    const trimmed = nextQuery.trim();
    if (!trimmed && !nextCategory) {
      onClearSearch?.();
      return;
    }
    onSearch?.({ query: trimmed, category: nextCategory });
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedCategory(null);
    closeAll();
    onClearSearch?.();
  };

  const selectCategory = (label: string) => {
    setSelectedCategory(label);
    closeAll();
  };

  const showClear = query.trim().length > 0 || selectedCategory !== null;

  return (
    <>
      <form
        dir="ltr"
        className="relative mx-auto flex h-14 w-full max-w-[572px] min-w-0"
        onSubmit={(event) => {
          event.preventDefault();
          emitSearch(query, selectedCategory);
        }}
      >
        <label className="relative h-14 min-w-0 flex-1">
          <span className="sr-only">{t('placeholder')}</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-content-muted"
            aria-hidden
          />
          <Input
            type="search"
            dir="rtl"
            value={query}
            onChange={(event) => {
              const next = event.target.value;
              setQuery(next);
              // Native search "x" clears the value — exit search mode.
              if (!next.trim()) {
                setSelectedCategory(null);
                onClearSearch?.();
              }
            }}
            placeholder={t('placeholder')}
            className={cn(
              'h-14 rounded-l-[28px] rounded-r-none border-border bg-home-search-category pl-12 text-end text-base leading-6 tracking-[0.0094em] shadow-none',
              showClear ? 'pr-11' : 'pr-5',
              '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
            )}
          />
          {showClear ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t('clear')}
              onClick={clearSearch}
              className="absolute right-3 top-1/2 size-7 -translate-y-1/2 rounded-full text-content-muted hover:bg-muted hover:text-content"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </label>
        <div className="relative shrink-0" ref={categoryWrapRef}>
          <Button
            type="button"
            variant="default"
            size="none"
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
              'h-14 max-w-[160px] shrink-0 gap-1 rounded-l-none rounded-r-[100px] bg-primary-subtle px-3 text-sm font-medium leading-6 tracking-[0.0094em] text-accent-foreground hover:bg-primary-subtle hover:opacity-90 dark:bg-primary-700 dark:text-primary-100 dark:hover:bg-primary-700 min-[834px]:max-w-[220px] min-[834px]:px-5 min-[834px]:text-base',
              (listOpen || categoryOpen) && 'opacity-90'
            )}
          >
            <span className="truncate">{selectedCategory ?? t('category')}</span>
            <CategoryTriggerChevron open={listOpen || categoryOpen} />
          </Button>
          <CategoryMenuDropdown
            open={listOpen}
            onClose={() => setListOpen(false)}
            onSelect={selectCategory}
            containerRef={categoryWrapRef}
          />
        </div>
      </form>

      <HomeCategoryOverlay
        open={categoryOpen}
        onClose={closeAll}
        onSelect={selectCategory}
      />
    </>
  );
}
