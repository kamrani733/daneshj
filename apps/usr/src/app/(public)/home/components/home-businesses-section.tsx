import { getTranslations } from 'next-intl/server';

import { BUSINESS_ITEMS } from '../data/home-content';
import { ContentCard } from './content-card';
import { SectionTitle } from './section-title';
import { ViewAllLink } from './view-all-link';

/** Figma #5847:169349 — title right, view-all left, horizontal scroll 344px cards. */
export async function HomeBusinessesSection() {
  const t = await getTranslations('home.businesses');

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-12">
      <SectionTitle
        title={t('title')}
        variant="narrow"
        className="hidden w-[257px] shrink-0 self-start min-[834px]:inline-flex [&_img]:w-[233px]"
      />

      <div className="flex items-center justify-between min-[834px]:hidden">
        <ViewAllLink label={t('viewAll')} className="px-2" />
        <SectionTitle
          title={t('title')}
          variant="narrow"
          className="!min-h-[49px] !w-auto !max-w-[139px] [&_h2]:pt-0 [&_h2]:text-base [&_h2]:leading-5 [&_img]:bottom-0 [&_img]:h-[38px] [&_img]:w-[123px]"
        />
      </div>

      <div className="flex w-full flex-col gap-4">
        <ViewAllLink label={t('viewAll')} className="hidden self-end px-2 min-[834px]:inline-flex" />

        <div className="relative left-1/2 flex w-screen max-w-[1512px] -translate-x-1/2 flex-row-reverse gap-4 overflow-x-auto pb-2 [scrollbar-width:thin] min-[834px]:gap-0">
          {BUSINESS_ITEMS.map((item) => (
            <ContentCard
              key={item.id}
              variant="business"
              header={t('cardHeader')}
              subhead={t('cardSubhead')}
              title={t('cardTitle')}
              subtitle={t('cardSubtitle')}
              description={t('cardDescription')}
              imageSrc={item.imageSrc}
              imageAlt={t('cardImageAlt')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
