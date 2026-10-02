import { getTranslations } from 'next-intl/server';

import { BusinessCard } from '@/components/cards';
import { ScrollCarousel } from '@/components/ui/scroll-carousel';

import { BUSINESS_ITEMS } from '@home/data/home-content';
import { HomeCarouselSectionHeader } from '@home/components/home-carousel-section-header';

/** Home «کسب و کار ها» (home Figma): bar title + view-all, carousel with arrows. */
export async function HomeBusinessesSection() {
  const t = await getTranslations('home.businesses');

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-8">
      <HomeCarouselSectionHeader title={t('title')} viewAllLabel={t('viewAll')} />

      <ScrollCarousel prevLabel={t('prev')} nextLabel={t('next')}>
        {BUSINESS_ITEMS.map((item) => (
          <BusinessCard key={item.id} title={item.title} imageSrc={item.imageSrc} />
        ))}
      </ScrollCarousel>
    </section>
  );
}
