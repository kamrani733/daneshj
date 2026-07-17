import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { cn } from '@/lib/utils';

import { HOME_CATEGORY_LINKS } from '../data/home-category-links';

/** Figma Category desktop #53:532 · mobile #2333:2172 — title + icon links (before discounts). */
export async function HomeCategoriesSection() {
  const t = await getTranslations('home.categories');

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-10">
      <div className="flex flex-col items-center gap-1 self-center">
        <h2 className="text-center text-base font-bold leading-5 text-primary min-[834px]:text-2xl min-[834px]:leading-9">
          {t('title')}
        </h2>
        <span
          aria-hidden
          className="h-[3px] w-[123px] rounded-full bg-warning min-[834px]:w-[187px]"
        />
      </div>

      <div
        className={cn(
          'grid w-full grid-cols-3 gap-x-2 gap-y-6',
          'min-[834px]:grid-cols-4 min-[834px]:gap-x-8 min-[834px]:gap-y-10',
          'min-[1100px]:grid-cols-7 min-[1100px]:gap-x-[61px]'
        )}
      >
        {HOME_CATEGORY_LINKS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            dir="rtl"
            className={cn(
              'group flex w-full flex-col items-center gap-3',
              'min-[834px]:max-w-[135px] min-[834px]:gap-4 min-[834px]:justify-self-center',
              'max-[833px]:last:col-start-2'
            )}
          >
            <span
              className={cn(
                'flex size-[96px] items-center justify-center overflow-hidden rounded-full shadow-home-elevation-1',
                'bg-white dark:bg-home-search-fill',
                'transition-transform group-hover:scale-[1.03]',
                'min-[834px]:size-[135px]'
              )}
            >
              <Image
                src={item.iconSrc}
                alt=""
                width={120}
                height={120}
                className="size-[84px] object-contain min-[834px]:size-[120px]"
              />
            </span>
            <span className="w-full text-center text-xs font-semibold leading-4 tracking-[0.0083em] text-content-muted min-[834px]:text-sm min-[834px]:leading-5 min-[834px]:tracking-[0.0071em]">
              {t(`items.${item.labelKey}`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
