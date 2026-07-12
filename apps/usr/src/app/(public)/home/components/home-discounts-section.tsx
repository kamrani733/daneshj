import { getTranslations } from 'next-intl/server';

import { DISCOUNT_ITEMS } from '../data/home-content';
import { ContentCard } from './content-card';
import { SectionTitle } from './section-title';
import { ViewAllLink } from './view-all-link';

/** Figma discounts — 4×320px grid desktop, horizontal scroll mobile. */
export async function HomeDiscountsSection() {
  const t = await getTranslations('home.discounts');

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title={t('title')} className="self-end" />

      <div className="flex justify-center">
        <ViewAllLink label={t('viewAll')} />
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] min-[834px]:mx-0 min-[834px]:grid min-[834px]:grid-cols-2 min-[834px]:overflow-visible min-[834px]:px-0 min-[1512px]:grid-cols-4">
        {DISCOUNT_ITEMS.map((item) => (
          <ContentCard
            key={item.id}
            variant="discount"
            title={t('cardTitle')}
            subtitle={t('cardSubtitle')}
            badge={t('cardBadge')}
            imageSrc={item.imageSrc}
            imageAlt={t('cardImageAlt')}
            className="min-[834px]:w-full"
          />
        ))}
      </div>
    </section>
  );
}
