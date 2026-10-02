import { getTranslations } from 'next-intl/server';

import { DiscountCard } from '@/components/cards';
import { cn } from '@/lib/utils';

import { DISCOUNT_ITEMS } from '@home/data/home-content';
import { HomeCarouselSectionHeader } from '@home/components/home-carousel-section-header';

/**
 * Home «تخفیف‌ها» (home Figma): bar title + «مشاهده همه» in one row; desktop 4×2,
 * tablet 2 columns, phones a horizontal scroll of 280px cards.
 */
export async function HomeDiscountsSection() {
  const t = await getTranslations('home.discounts');

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-8">
      <HomeCarouselSectionHeader title={t('title')} viewAllLabel={t('viewAll')} />

      <div
        dir="rtl"
        className={cn(
          '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          '[&>*]:w-[280px] [&>*]:shrink-0 [&>*]:snap-start',
          'min-[834px]:mx-0 min-[834px]:grid min-[834px]:grid-cols-2 min-[834px]:gap-x-4 min-[834px]:gap-y-8 min-[834px]:overflow-visible min-[834px]:px-0 min-[834px]:pb-0',
          'min-[834px]:[&>*]:w-auto',
          'min-[1280px]:grid-cols-4'
        )}
      >
        {DISCOUNT_ITEMS.map(({ id, ...item }) => (
          <DiscountCard key={id} {...item} />
        ))}
      </div>
    </section>
  );
}
