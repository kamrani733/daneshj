import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { cn } from '@/lib/utils';

import { HOME_CATEGORY_LINKS } from '../data/home-category-links';

/** Figma Category #53:532 — title + 7×2 circular icon links (before discounts). */
export async function HomeCategoriesSection() {
  const t = await getTranslations('home.categories');

  return (
    <section className="flex w-full flex-col gap-6 min-[834px]:gap-10">
      <div className="flex flex-col items-center gap-1 self-center">
        <h2 className="text-center text-xl font-bold leading-7 text-primary min-[834px]:text-2xl min-[834px]:leading-9">
          {t('title')}
        </h2>
        <span aria-hidden className="h-[3px] w-[min(187px,100%)] rounded-full bg-warning" />
      </div>

      <div
        className={cn(
          '-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin]',
          'min-[834px]:mx-0 min-[834px]:grid min-[834px]:grid-cols-4 min-[834px]:gap-x-8 min-[834px]:gap-y-10 min-[834px]:overflow-visible min-[834px]:px-0 min-[834px]:pb-0',
          'min-[1100px]:grid-cols-7 min-[1100px]:gap-x-[61px]'
        )}
      >
        {HOME_CATEGORY_LINKS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            dir="rtl"
            className="group flex w-[112px] shrink-0 flex-col items-center gap-4 min-[834px]:w-full min-[834px]:max-w-[135px] min-[834px]:justify-self-center"
          >
            <span
              className={cn(
                'flex size-[112px] items-center justify-center overflow-hidden rounded-full shadow-home-elevation-1',
                'bg-white dark:bg-home-search-fill',
                'transition-transform group-hover:scale-[1.03]',
                'min-[834px]:size-[135px]'
              )}
            >
              <Image
                src={item.iconSrc}
                alt=""
                width={140}
                height={140}
                className="size-[100px] object-contain min-[834px]:size-[120px]"
              />
            </span>
            <span className="w-full text-center text-sm font-semibold leading-5 tracking-[0.0071em] text-content-muted">
              {t(`items.${item.labelKey}`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
