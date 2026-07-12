import { getTranslations } from 'next-intl/server';

import { BUSINESS_ITEMS } from '../data/home-content';
import { ContentCard } from './content-card';
import { SectionTitle } from './section-title';
import { ViewAllLink } from './view-all-link';

/** Figma Business row — horizontal scroll, card 344×272 desktop / 260 mobile. */
export async function HomeBusinessesSection() {
  const t = await getTranslations('home.businesses');

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle title={t('title')} className="self-end" />

      <div className="flex justify-center">
        <ViewAllLink label={t('viewAll')} />
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] min-[834px]:mx-0 min-[834px]:px-0">
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
    </section>
  );
}
