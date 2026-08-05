'use client';

import { useTranslations } from 'next-intl';
import { useState, type SVGProps } from 'react';

import type {
  PublicPanelSocialLink,
  SocialNetwork,
} from '@public-panel/data/public-panel-ui';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type SocialLinksRowProps = {
  links: PublicPanelSocialLink[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  dir?: 'ltr' | 'rtl';
};

type IconProps = SVGProps<SVGSVGElement>;

function iconClass(className?: string) {
  return cn('size-5', className);
}

function MailIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass(className)} {...props}>
      <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass(className)} {...props}>
      <path d="M21.5 4.5 3.7 11.2c-1.2.5-1.2 1.7-.2 2.1l4.4 1.4 1.7 5.3c.3.9 1.2 1.1 1.8.4l2.5-2.7 4.7 3.5c.9.6 1.8.2 2.1-.8L22.8 5.8c.3-1.1-.6-2-1.3-1.3Z" />
    </svg>
  );
}

function InstagramIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass(className)} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function XIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass(className)} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function WhatsAppIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass(className)} {...props}>
      <path d="M12 2.2A9.7 9.7 0 0 0 2.5 11.8c0 1.7.5 3.3 1.3 4.7L2.2 22l5.6-1.5a9.7 9.7 0 0 0 14.1-8.7A9.7 9.7 0 0 0 12 2.2Zm0 17.6c-1.5 0-2.9-.4-4.2-1.1l-.3-.2-3.3.9.9-3.2-.2-.3a7.4 7.4 0 1 1 7.1 3.9Zm4.1-5.5c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1-.2.2-.6.7-.7.9-.1.1-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.1-.4 0-.1 0-.3-.1-.4-.1-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 2.3.9 2.3.6 2.7.6.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

function LinkedInIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass(className)} {...props}>
      <path d="M6.5 9H3.7v11.2h2.8V9ZM5.1 3.8a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20.3 12.3c0-2.4-1.5-3.6-3.5-3.6-1.3 0-2.2.6-2.7 1.4h-.1V9H11.3v11.2h2.8v-5.5c0-1.4.3-2.8 2-2.8 1.7 0 1.7 1.6 1.7 2.9v5.4h2.8v-6.9Z" />
    </svg>
  );
}

function GlobeIcon({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass(className)} {...props}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.75 12h16.5M12 3.75c2.5 2.7 2.5 13.8 0 16.5M12 3.75c-2.5 2.7-2.5 13.8 0 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const ICONS = {
  email: MailIcon,
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  x: XIcon,
  whatsapp: WhatsAppIcon,
  linkedin: LinkedInIcon,
  website: GlobeIcon,
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

function getCopyValue(link: PublicPanelSocialLink): string {
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
  const t = useTranslations('publicPanel');
  const tSocial = useTranslations('publicPanel.social');
  const [openNetwork, setOpenNetwork] = useState<SocialNetwork | null>(null);
  const [copiedNetwork, setCopiedNetwork] = useState<SocialNetwork | null>(null);

  const box =
    size === 'lg' ? 'size-14' : size === 'md' ? 'size-12' : 'size-10';
  const iconSize =
    size === 'lg' ? 'size-6' : size === 'md' ? 'size-6' : 'size-[18px]';

  async function handleCopy(link: PublicPanelSocialLink) {
    const value = getCopyValue(link);
    try {
      await navigator.clipboard.writeText(value);
      setCopiedNetwork(link.network);
      window.setTimeout(() => {
        setOpenNetwork((current) =>
          current === link.network ? null : current
        );
        setCopiedNetwork((current) =>
          current === link.network ? null : current
        );
      }, 1800);
    } catch {
      /* ignore clipboard failures */
    }
  }

  return (
    <ul dir={dir} className={cn('flex flex-wrap items-center gap-3', className)}>
      {links.map((link) => {
        const Icon = ICONS[link.network];
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
                    /* Open popover/modal: brand color */
                    open && BRAND_STYLES[link.network],
                    /* Idle outline (hero) */
                    !open &&
                      variant === 'outline' &&
                      'bg-home-stat-card text-primary shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:opacity-90 dark:text-primary-100',
                    /* Idle filled (service info) — primary green */
                    !open &&
                      variant === 'filled' &&
                      'bg-primary text-primary-foreground hover:opacity-90 dark:bg-primary-100 dark:text-primary-900'
                  )}
                >
                  <Icon className={iconSize} aria-hidden />
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
                    : 'flex-row items-center justify-between gap-6 rounded-2xl px-4 py-2.5'
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
