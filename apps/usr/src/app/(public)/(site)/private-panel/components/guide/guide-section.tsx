'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type GuideBlock = {
  id: string;
  title: string;
  body: string;
  kind: 'text' | 'accordion';
};

/** Guide tab: search + informational accordions/copy. */
export function GuideSection() {
  const t = useTranslations('privatePanel.guide');
  const [query, setQuery] = useState('');

  const blocks = useMemo<GuideBlock[]>(
    () => [
      {
        id: 'intro',
        title: t('subsectionFields'),
        body: t('intro'),
        kind: 'text',
      },
      {
        id: 'edit',
        title: t('editAccordion'),
        body: t('editBody'),
        kind: 'accordion',
      },
      {
        id: 'confirm',
        title: t('confirmAccordion'),
        body: t('confirmBody'),
        kind: 'accordion',
      },
      {
        id: 'manage',
        title: t('manageTitle'),
        body: t('manageBody'),
        kind: 'text',
      },
    ],
    [t]
  );

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? blocks.filter(
        (block) =>
          block.title.toLowerCase().includes(normalized) ||
          block.body.toLowerCase().includes(normalized)
      )
    : blocks;

  const accordionItems = filtered.filter((b) => b.kind === 'accordion');
  const textItems = filtered.filter((b) => b.kind === 'text');

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="relative w-full max-w-md self-end">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-home-filter-muted"
          strokeWidth={1.5}
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchAria')}
          className="h-11 rounded-full border-border bg-home-card pe-4 ps-11 dark:bg-home-search-category"
        />
      </div>

      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="h-7 w-1.5 shrink-0 rounded-full bg-warning"
        />
        <h2 className="text-xl font-bold leading-8 text-content dark:text-primary-100">
          {t('title')}
        </h2>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-home-filter-muted">{t('emptySearch')}</p>
      ) : (
        <div className="flex flex-col gap-5">
          {textItems
            .filter((item) => item.id === 'intro')
            .map((item) => (
              <div key={item.id} className="flex flex-col gap-3">
                <h3 className="text-base font-bold text-content dark:text-home-filter-ink">
                  {item.title}
                </h3>
                <p className="text-justify text-sm font-medium leading-6 text-home-filter-muted dark:text-home-filter-ink">
                  {item.body}
                </p>
              </div>
            ))}

          {accordionItems.length > 0 ? (
            <Accordion type="multiple" className="flex flex-col gap-3">
              {accordionItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>{item.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : null}

          {textItems
            .filter((item) => item.id !== 'intro')
            .map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex flex-col gap-3 rounded-2xl border border-border',
                  'bg-home-card p-5 dark:bg-home-search-category'
                )}
              >
                <h3 className="text-base font-bold text-content dark:text-home-filter-ink">
                  {item.title}
                </h3>
                <p className="text-justify text-sm font-medium leading-6 text-home-filter-muted dark:text-home-filter-ink">
                  {item.body}
                </p>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
