'use client';

import { useTranslations } from 'next-intl';
import type { SVGProps } from 'react';

import type { PublicPanelSocialLink } from '@public-panel/data/public-panel-ui';
import { cn } from '@/lib/utils';

type SocialLinksRowProps = {
  links: PublicPanelSocialLink[];
  className?: string;
  size?: 'sm' | 'lg';
  /** Hero uses outline; service-info uses filled (Figma). */
  variant?: 'outline' | 'filled';
  /** Override list direction (hero socials are LTR icon order). */
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

/** Social / contact icon row — outline (hero) or filled (service info). */
export function SocialLinksRow({
  links,
  className,
  size = 'sm',
  variant = 'filled',
  dir,
}: SocialLinksRowProps) {
  const t = useTranslations('publicPanel.social');
  const box = size === 'lg' ? 'size-14' : 'size-10';
  const iconSize = size === 'lg' ? 'size-6' : 'size-[18px]';

  return (
    <ul dir={dir} className={cn('flex flex-wrap items-center gap-3', className)}>
      {links.map((link) => {
        const Icon = ICONS[link.network];
        return (
          <li key={link.network}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(link.network)}
              className={cn(
                'inline-flex items-center justify-center rounded-full transition-opacity hover:opacity-90',
                box,
                variant === 'filled'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-primary bg-transparent text-primary'
              )}
            >
              <Icon className={iconSize} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
