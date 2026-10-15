import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import type { ManagedService, ManagedServiceKey } from '@operational-panel/types/services';

const SERVICE_IMAGES: Record<ManagedServiceKey, string> = {
  discount: '/images/operational-panel/services/discount.webp',
  referral: '/images/operational-panel/services/referral.webp',
  patogh: '/images/operational-panel/services/patogh.webp',
  universityPrograms: '/images/operational-panel/services/universityPrograms.webp',
  rewards: '/images/operational-panel/services/rewards.webp',
  news: '/images/operational-panel/services/news.webp',
  calendarEvents: '/images/operational-panel/services/calendarEvents.webp',
  newsletter: '/images/operational-panel/services/newsletter.webp',
};

/** Figma «Tag-services»: active = tonal, padding 6 · inactive = outlined, 12 / 20 (wraps on narrow cards, as drawn). */
const CHIP = 'inline-flex h-8 items-center rounded-full border font-medium';

/**
 * Figma «Main Services» card (Default / Hovered / Pressed): image, service name, active / inactive product
 * chips, «برو به پنل عملیاتی سرویس». The whole card links to the service panel once it has one.
 */
export function ManagedServiceCard({ service }: { service: ManagedService }) {
  const t = useTranslations('operationalPanel.manageServices');
  const name = t(`services.${service.key}`);
  const interactive = service.panelHref !== null;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-medium border border-outline-variant bg-surface transition-[background-color,box-shadow]',
        interactive &&
          'has-[a:hover]:border-transparent has-[a:hover]:bg-surface-container-low has-[a:hover]:shadow-app-elevation-1 has-[a:active]:bg-surface-container-highest has-[a:active]:shadow-none'
      )}
    >
      <div className="relative h-47 w-full shrink-0 bg-surface-container-high">
        <Image src={SERVICE_IMAGES[service.key]} alt="" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-6 p-4">
        <h3 className="text-body-large text-on-surface">{name}</h3>
        <ul className="flex flex-wrap gap-x-3 gap-y-2" aria-label={t('productsLabel')}>
          <li className={cn(CHIP, 'border-primary-container bg-primary-container px-1.5 text-primary')}>
            {/* Size outside `cn()`: tailwind-merge reads M3 sizes as colours (09-known-issues). */}
            <span className="text-label-large">
              {t('activeProducts', { count: formatFaNumber(service.activeProducts) })}
            </span>
          </li>
          <li className={cn(CHIP, 'border-outline-variant bg-inverse-on-surface ps-3 pe-5 text-outline')}>
            <span className="text-label-large">
              {t('inactiveProducts', { count: formatFaNumber(service.inactiveProducts) })}
            </span>
          </li>
        </ul>
        <div className="mt-auto flex h-10 items-center">
          {interactive ? (
            <Link
              href={service.panelHref ?? ''}
              aria-label={t('goToPanelOf', { service: name })}
              className="rounded-full px-4 py-2.5 text-label-large font-medium text-primary after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {t('goToPanel')}
            </Link>
          ) : (
            <span className="px-4 py-2.5 text-label-large font-medium text-primary">{t('goToPanel')}</span>
          )}
        </div>
      </div>
    </article>
  );
}
