'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { clearSession } from '@auth/lib/auth-actions';
import { AUTH_ROUTES } from '@auth/lib/auth-routes';
import { PUBLIC_PANEL_PATH } from '@public-panel/data/public-panel-mock';
import { Button } from '@/components/ui/button';
import { useDismissible } from '@/hooks/use-dismissible';
import { cn } from '@/lib/utils';

export type UserProfileMenuProps = {
  displayName: string;
  userType?: string;
  triggerLabel: string;
  trigger: (props: {
    open: boolean;
    menuId: string;
    onToggle: () => void;
  }) => React.ReactNode;
};

/** Figma Menu #1:332 / library #2354:2437 — user account menu under avatar. */
const MENU_ITEMS = [
  { key: 'privatePanel' as const, href: '/' },
  { key: 'publicPanel' as const, href: PUBLIC_PANEL_PATH },
  { key: 'operationalPanel' as const, href: AUTH_ROUTES.dashboard },
  { key: 'membershipOps' as const, href: AUTH_ROUTES.dashboard },
  { key: 'sessions' as const, href: AUTH_ROUTES.dashboard },
  { key: 'security' as const, href: AUTH_ROUTES.dashboard },
];

type MenuCoords = {
  top: number;
  left: number;
};

const itemClassName =
  'flex h-14 w-full items-center justify-start rounded-none px-3 text-right text-base font-normal leading-6 tracking-[0.0094em] text-content hover:bg-black/5 dark:hover:bg-white/5';

export function UserProfileMenu({
  displayName,
  userType,
  triggerLabel,
  trigger,
}: UserProfileMenuProps) {
  const t = useTranslations('home.header.profileMenu');
  const router = useRouter();
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const [mounted, setMounted] = useState(false);

  const typeLabel = userType?.trim() || t('userType');
  const headerLabel = ` ${displayName} ( ${typeLabel} )`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !wrapRef.current) return;

    const updatePosition = () => {
      const triggerRect = wrapRef.current?.getBoundingClientRect();
      if (!triggerRect) return;

      const menuWidth = 264;
      const gap = 6;
      const padding = 8;
      let left = triggerRect.left;

      left = Math.min(left, window.innerWidth - menuWidth - padding);
      left = Math.max(padding, left);

      setCoords({
        top: triggerRect.bottom + gap,
        left,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  const dismiss = useCallback(() => setOpen(false), []);
  useDismissible(open, dismiss, [wrapRef, menuRef]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await clearSession();
      setOpen(false);
      router.push(AUTH_ROUTES.home);
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const menu =
    open && coords && mounted
      ? createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={triggerLabel}
            dir="rtl"
            style={{ top: coords.top, left: coords.left, zIndex: 9999 }}
            className={cn(
              'fixed w-[264px] rounded bg-home-search-category py-2 text-right shadow-home-elevation-2'
            )}
          >
            <div className="border-b-2 border-[#BFC9C1] px-3 py-4 text-base leading-6 tracking-[0.0094em] text-content dark:border-border">
              {headerLabel}
            </div>

            <ul className="flex flex-col" role="none">
              {MENU_ITEMS.map((item) => (
                <li key={item.key} role="none">
                  <Link
                    href={item.href}
                    role="menuitem"
                    className={itemClassName}
                    onClick={() => setOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              <li role="none">
                <Button
                  type="button"
                  variant="ghost"
                  size="none"
                  role="menuitem"
                  disabled={loggingOut}
                  loading={loggingOut}
                  className={itemClassName}
                  onClick={() => void handleLogout()}
                >
                  {t('logout')}
                </Button>
              </li>
            </ul>
          </div>,
          document.body
        )
      : null;

  return (
    <div ref={wrapRef} className="relative">
      {trigger({
        open,
        menuId,
        onToggle: () => setOpen((value) => !value),
      })}
      {menu}
    </div>
  );
}
