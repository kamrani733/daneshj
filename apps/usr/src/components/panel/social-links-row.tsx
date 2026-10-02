'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { partitionServiceSocialLinks } from '@/components/panel/social-contact';
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
  /** `xl` = fixed 56px (phone service grid). */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'outline' | 'filled';
  dir?: 'ltr' | 'rtl';
  /** `serviceGrid`: hero networks on row 1, Git · mobile · phone · website on row 2 (Figma `400:139510`). */
  layout?: 'row' | 'serviceGrid';
};

const ICON_PATHS: Record<SocialNetwork, string> = {
  email: '/images/social/email.svg',
  telegram: '/images/social/telegram.svg',
  instagram: '/images/social/instagram.svg',
  x: '/images/social/x.svg',
  whatsapp: '/images/social/whatsapp.svg',
  linkedin: '/images/social/linkedin.svg',
  github: '/images/social/github.svg',
  mobile: '/images/social/mobile.svg',
  phone: '/images/social/phone.svg',
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
  github: 'bg-neutral-black text-primary-foreground',
  mobile: 'bg-primary-700 text-primary-foreground',
  phone: 'bg-primary-700 text-primary-foreground',
  website: 'bg-info-600 text-primary-foreground',
};

const PILL_BG = 'bg-app-search-category dark:bg-app-stat-card';

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
  if (network === 'mobile' || network === 'phone') return href.replace(/^tel:/i, '');
  return href.replace(/^https?:\/\//i, '');
}

export function SocialLinksRow({
  links,
  className,
  size = 'sm',
  variant = 'filled',
  dir,
  layout = 'row',
}: SocialLinksRowProps) {
  if (layout === 'serviceGrid') {
    const { row1, row2 } = partitionServiceSocialLinks(links);
    return (
      <>
        {/* Phones: one wrapping list, four 56px icons per row (responsive export). */}
        <SocialLinksList
          links={[...row1, ...row2]}
          className="mx-auto max-w-[272px] justify-center gap-4 min-[720px]:hidden"
          size="xl"
          variant={variant}
          dir={dir}
        />
      <div className="hidden flex-col items-center gap-4 min-[720px]:flex">
        {[row1, row2].map((row, index) =>
          row.length > 0 ? (
            <SocialLinksRow
              key={index}
              links={row}
              className={cn('flex-nowrap', className)}
              size={size}
              variant={variant}
              dir={dir}
            />
          ) : null,
        )}
      </div>
      </>
    );
  }
  return (
    <SocialLinksList
      links={links}
      className={className}
      size={size}
      variant={variant}
      dir={dir}
    />
  );
}

function SocialLinksList({
  links,
  className,
  size = 'sm',
  variant = 'filled',
  dir,
}: Omit<SocialLinksRowProps, 'layout'>) {
  const t = useTranslations('panel');
  const tSocial = useTranslations('panel.social');
  const [openNetwork, setOpenNetwork] = useState<SocialNetwork | null>(null);
  const [copiedNetwork, setCopiedNetwork] = useState<SocialNetwork | null>(
    null,
  );

  // `lg` steps down on phones so six icons fit one row (6×44 + gaps ≤ 343).
  const box =
    size === 'xl'
      ? 'size-14'
      : size === 'lg'
      ? 'size-11 min-[720px]:size-14'
      : size === 'md'
        ? 'size-10 min-[720px]:size-12'
        : 'size-10';
  const iconSize =
    size === 'xl'
      ? 'size-7'
      : size === 'lg'
      ? 'size-5 min-[720px]:size-6'
      : size === 'md'
        ? 'size-5 min-[720px]:size-6'
        : 'size-[18px]';

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
                      'bg-app-stat-card text-primary shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:opacity-90 dark:text-primary-100',
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
                  <span className="text-sm font-medium text-app-filter-ink">
                    {t('copied')}
                  </span>
                ) : (
                  <>
                    <span className="max-w-[220px] truncate text-sm font-medium text-app-filter-ink">
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
