import { getTranslations } from 'next-intl/server';

import { BUSINESS_ITEMS } from '../data/home-content';
import { ContentCard } from './content-card';
import { HomeCarouselSectionHeader } from './home-carousel-section-header';
import { ViewAllLink } from './view-all-link';

/** Figma #5847:169349 — title right, view-all left, horizontal scroll 344px cards. */
export async function HomeBusinessesSection() {
  const t = await getTranslations('home.businesses');

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-12">
      <HomeCarouselSectionHeader
        title={t('title')}
        viewAllLabel={t('viewAll')}
        desktopTitleClassName="w-[257px] [&_img]:w-[233px]"
      />

      <div className="flex w-full flex-col gap-4">
        <ViewAllLink label={t('viewAll')} className="hidden self-end px-2 min-[834px]:inline-flex" />

        <div className="-mx-4 flex flex-row-reverse gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] min-[834px]:mx-0 min-[834px]:px-0">
          {BUSINESS_ITEMS.map((item) => (
            <ContentCard
              key={item.id}
              variant="business"
              title={t('cardTitle')}
              imageSrc={item.imageSrc}
              imageAlt={t('cardImageAlt')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
