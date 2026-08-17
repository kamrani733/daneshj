'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { PanelSocialLink, SocialNetwork } from '@/components/panel/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type SocialLinksRowProps = {
  links: PanelSocialLink[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  dir?: 'ltr' | 'rtl';
};

const ICON_PATHS: Record<SocialNetwork, string> = {
  email: '/images/social/email.svg',
  telegram: '/images/social/telegram.svg',
  instagram: '/images/social/instagram.svg',
  x: '/images/social/x.svg',
  whatsapp: '/images/social/whatsapp.svg',
  linkedin: '/images/social/linkedin.svg',
  website: '/images/social/website.svg',
} as const;

const BRAND_STYLES: Record<SocialNetwork, string> = {
  email: 'bg-info text-primary-foreground',
  telegram: 'bg-[#2AABEE] text-primary-foreground',
  instagram:
    'bg-[linear-gradient(45deg,#F58529_0%,#DD2A7B_50%,#8134AF_100%)] text-primary-foreground',
  x: 'bg-neutral-black text-primary-foreground',
  whatsapp: 'bg-[#25D366] text-primary-foreground',
  linkedin: 'bg-info-700 text-primary-foreground',
  website: 'bg-info-600 text-primary-foreground',
};

const PILL_BG = 'bg-home-search-category dark:bg-home-stat-card';

function getCopyValue(link: PanelSocialLink): string {
  const { network, href } = link;
  if (network === 'email') return href.replace(/^mailto:/i, '');
  if (network === 'whatsapp') {
    const match = href.match(/(?:wa\.me\/|phone=)(\+?\d+)/i);
    return match ? match[1] : href;
  }
  if (network === 'telegram') {
    const match = href.match(/t\.me\/([^/?#]+)/i);
    return match ? `@${match[1]}` : href;
  }
  return href.replace(/^https?:\/\//i, '');
}

export function SocialLinksRow({
  links,
  className,
  size = 'sm',
  variant = 'filled',
  dir,
}: SocialLinksRowProps) {
  const t = useTranslations('panel');
  const tSocial = useTranslations('panel.social');
  const [openNetwork, setOpenNetwork] = useState<SocialNetwork | null>(null);
  const [copiedNetwork, setCopiedNetwork] = useState<SocialNetwork | null>(
    null,
  );

  const box = size === 'lg' ? 'size-14' : size === 'md' ? 'size-12' : 'size-10';
  const iconSize =
    size === 'lg' ? 'size-6' : size === 'md' ? 'size-6' : 'size-[18px]';

  async function handleCopy(link: PanelSocialLink) {
    const value = getCopyValue(link);
    try {
      await navigator.clipboard.writeText(value);
      setCopiedNetwork(link.network);
      window.setTimeout(() => {
        setOpenNetwork((current) =>
          current === link.network ? null : current,
        );
        setCopiedNetwork((current) =>
          current === link.network ? null : current,
        );
      }, 1800);
    } catch {
      /* ignore clipboard failures */
    }
  }

  return (
    <ul
      dir={dir}
      className={cn(
        'flex justify-start flex-wrap items-center gap-3',
        className,
      )}
    >
      {links.map((link) => {
        const open = openNetwork === link.network;
        const copied = copiedNetwork === link.network;
        const copyValue = getCopyValue(link);

        return (
          <li key={link.network}>
            <Popover
              open={open}
              onOpenChange={(next) => {
                setOpenNetwork(next ? link.network : null);
                if (!next) setCopiedNetwork(null);
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={tSocial(link.network)}
                  className={cn(
                    'inline-flex items-center justify-center rounded-full transition-all',
                    box,
                    open && BRAND_STYLES[link.network],
                    !open &&
                      variant === 'outline' &&
                      'bg-home-stat-card text-primary shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:opacity-90 dark:text-primary-100',
                    !open &&
                      variant === 'filled' &&
                      'bg-primary text-primary-foreground hover:opacity-90 dark:bg-primary-100 dark:text-primary-900',
                  )}
                >
                  <span
                    className={cn(
                      'bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]',
                      iconSize,
                    )}
                    style={{
                      WebkitMaskImage: `url(${ICON_PATHS[link.network]})`,
                      maskImage: `url(${ICON_PATHS[link.network]})`,
                    }}
                    aria-hidden
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="center"
                sideOffset={10}
                dir="rtl"
                className={cn(
                  'flex w-auto min-w-0 border-0 p-0 shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-0',
                  PILL_BG,
                  copied
                    ? 'items-center justify-center rounded-full px-4 py-2.5'
                    : 'flex-row items-center justify-between gap-6 rounded-2xl px-4 py-2.5',
                )}
              >
                {copied ? (
                  <span className="text-sm font-medium text-home-filter-ink">
                    {t('copied')}
                  </span>
                ) : (
                  <>
                    <span className="max-w-[220px] truncate text-sm font-medium text-home-filter-ink">
                      {copyValue}
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopy(link)}
                      className="shrink-0 text-sm font-medium text-primary hover:underline dark:text-primary-100"
                    >
                      {tSocial('copy')}
                    </button>
                  </>
                )}
              </PopoverContent>
            </Popover>
          </li>
        );
      })}
    </ul>
  );
}
