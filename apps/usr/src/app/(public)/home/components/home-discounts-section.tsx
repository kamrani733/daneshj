import { getTranslations } from 'next-intl/server';

import { cn } from '@/lib/utils';

import { DISCOUNT_ITEMS } from '../data/home-content';
import { ContentCard } from './content-card';
import { HomeCarouselSectionHeader } from './home-carousel-section-header';
import { ViewAllLink } from './view-all-link';

/** Figma #1:8912 Title Box + #1:9041 content — 4×2 grid, title right, view-all left. */
export async function HomeDiscountsSection() {
  const t = await getTranslations('home.discounts');

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-12">
      <HomeCarouselSectionHeader
        title={t('title')}
        viewAllLabel={t('viewAll')}
      />

      {/* Content frame #1:9041 — column gap 16px */}
      <div className="flex w-full flex-col gap-4">
        {/* View-all #1:9042 — left (end in RTL), padding 0 8px */}
        <ViewAllLink label={t('viewAll')} className="hidden self-end px-2 min-[834px]:inline-flex" />

        {/* Group 465 — 4×320px, gap 16px / 32px, no scroll */}
        <div
          className={cn(
            '-mx-4 flex flex-row-reverse gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin]',
            'min-[834px]:mx-0 min-[834px]:grid min-[1034px]:grid-cols-2 min-[834px]:gap-x-4 min-[834px]:gap-y-8 min-[834px]:overflow-visible min-[834px]:px-0 min-[834px]:pb-0',
            'min-[1280px]:grid-cols-4'
          )}
        >
          {DISCOUNT_ITEMS.map((item) => (
            <ContentCard
              key={item.id}
              variant="discount"
              title={t('cardTitle')}
              subtitle={t('cardSubtitle')}
              imageSrc={item.imageSrc}
              imageAlt={t('cardImageAlt')}
              className="min-[834px]:w-full min-[834px]:max-w-none min-[834px]:shrink"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
