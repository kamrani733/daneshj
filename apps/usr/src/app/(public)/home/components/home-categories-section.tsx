import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { ScrollCarousel } from '@/components/ui/scroll-carousel';
import { cn } from '@/lib/utils';

import { HOME_CATEGORY_LINKS } from '@home/data/home-category-links';
import { SectionTitle } from '@home/components/section-title';

/**
 * Home categories (home Figma): desktop / tablet «دسته‌بندی‌ها» as one carousel
 * row with arrows; phones «دسته بندی تخفیف‌ها» as a 3-column grid.
 */
export async function HomeCategoriesSection() {
  const t = await getTranslations('home.categories');

  const items = HOME_CATEGORY_LINKS.map((item) => (
    <Link
      key={item.id}
      href={item.href}
      className="group flex w-[96px] shrink-0 flex-col items-center gap-3 min-[834px]:w-[135px] min-[834px]:gap-4"
    >
      <span
        className={cn(
          'flex size-[96px] items-center justify-center overflow-hidden rounded-full shadow-app-elevation-1',
          'bg-surface-container-lowest motion-safe:transition-transform group-hover:scale-[1.03]',
          'min-[834px]:size-[120px]'
        )}
      >
        <Image
          src={item.iconSrc}
          alt=""
          width={120}
          height={120}
          className="size-[84px] object-contain min-[834px]:size-[104px]"
        />
      </span>
      <span className="w-full text-center text-label-medium font-semibold text-on-surface-variant min-[834px]:text-label-large">
        {t(`items.${item.labelKey}`)}
      </span>
    </Link>
  ));

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-8">
      <SectionTitle title={t('titleMobile')} className="min-[834px]:hidden" />
      <SectionTitle title={t('title')} className="hidden min-[834px]:inline-flex" />

      <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-6 min-[834px]:hidden [&>*:last-child]:col-start-2">
        {items}
      </div>

      <ScrollCarousel
        prevLabel={t('prev')}
        nextLabel={t('next')}
        className="hidden px-6 min-[834px]:block"
        trackClassName="gap-6 py-2 min-[1280px]:gap-10"
      >
        {items}
      </ScrollCarousel>
    </section>
  );
}
