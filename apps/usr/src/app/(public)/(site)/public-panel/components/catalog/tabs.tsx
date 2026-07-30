'use client';

import { Info, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ServiceCatalog } from '@public-panel/data/public-panel-mock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { CatalogSection } from './catalog-section';
import { DiscountOfferCard } from './discount-offer-card';
import { EmptyState } from './empty-state';
import { NewsOfferCard } from './news-offer-card';
import { NewsletterOfferCard } from './newsletter-offer-card';

type PublicPanelTabsProps = {
  catalog: ServiceCatalog;
  otherInfo: string[];
};

/** Figma tabs under service-info — my services catalog / other info. */
export function PublicPanelTabs({ catalog, otherInfo }: PublicPanelTabsProps) {
  const t = useTranslations('publicPanel');
  const servicesCount =
    catalog.totals.discounts + catalog.totals.news + catalog.totals.newsletters;
  const hasServices =
    catalog.discounts.length > 0 ||
    catalog.news.length > 0 ||
    catalog.newsletters.length > 0;

  return (
    <Tabs defaultValue="services" className="w-full items-stretch gap-6">
      <TabsList className="w-full justify-center gap-8 border-b border-[#E5E7EB] pb-0 dark:border-border">
        <TabsTrigger
          value="services"
          className="gap-2 pb-3 text-base data-[state=active]:border-primary data-[state=active]:text-primary"
        >
          <ShoppingCart className="size-5" strokeWidth={1.5} aria-hidden />
          {t('tabs.services', { count: servicesCount })}
        </TabsTrigger>
        <TabsTrigger
          value="other"
          className="gap-2 pb-3 text-base data-[state=active]:border-primary data-[state=active]:text-primary"
        >
          <Info className="size-5" strokeWidth={1.5} aria-hidden />
          {t('tabs.other')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="services" className="mt-0 flex flex-col gap-8">
        {!hasServices ? (
          <EmptyState
            message={t('emptyServices')}
            className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-home-search-category"
          />
        ) : (
          <>
            {catalog.discounts.length > 0 ? (
              <CatalogSection
                title={t('catalog.discounts')}
                count={catalog.totals.discounts}
                gridClassName="grid-cols-1 min-[560px]:grid-cols-2 min-[960px]:grid-cols-4"
              >
                {catalog.discounts.map((offer) => (
                  <DiscountOfferCard key={offer.id} offer={offer} />
                ))}
              </CatalogSection>
            ) : null}

            {catalog.news.length > 0 ? (
              <CatalogSection
                title={t('catalog.news')}
                count={catalog.totals.news}
                gridClassName="grid-cols-1 min-[720px]:grid-cols-2 min-[1100px]:grid-cols-3"
              >
                {catalog.news.map((item) => (
                  <NewsOfferCard key={item.id} item={item} />
                ))}
              </CatalogSection>
            ) : null}

            {catalog.newsletters.length > 0 ? (
              <CatalogSection
                title={t('catalog.newsletters')}
                count={catalog.totals.newsletters}
                gridClassName="grid-cols-1 min-[560px]:grid-cols-2 min-[960px]:grid-cols-4"
              >
                {catalog.newsletters.map((item) => (
                  <NewsletterOfferCard key={item.id} item={item} />
                ))}
              </CatalogSection>
            ) : null}
          </>
        )}
      </TabsContent>

      <TabsContent value="other" className="mt-0">
        {otherInfo.length === 0 ? (
          <EmptyState
            message={t('emptyOther')}
            imageSrc="/public-panel/empty-state-alt.png"
            className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-home-search-category"
          />
        ) : (
          <ul className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-white p-4 dark:bg-home-search-category">
            {otherInfo.map((item) => (
              <li
                key={item}
                className="border-b border-border/40 pb-3 text-sm leading-6 text-home-filter-ink last:border-0 last:pb-0"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}
