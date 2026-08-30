'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState, type ReactNode } from 'react';

import {
  flattenGuideText,
  getGuideContentMessages,
  type GuideAccordionBlock,
  type GuideSectionBlock,
} from '@private-panel/data/guide-content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SearchField } from '@/components/ui/search-field';

/** Guide tab — stacked on mobile (full-width search), row on desktop. */
export function GuideSection() {
  const t = useTranslations('privatePanel.guide');
  const [query, setQuery] = useState('');

  const content = useMemo(() => getGuideContentMessages(), []);

  const editBlock: GuideAccordionBlock = { id: 'edit', ...content.edit };
  const confirmBlock: GuideAccordionBlock = {
    id: 'confirm',
    ...content.confirm,
  };
  const manageBlock: GuideSectionBlock = { id: 'manage', ...content.manage };

  const searchable = useMemo(() => flattenGuideText(content), [content]);
  const normalized = query.trim().toLowerCase();

  const matchesSearch =
    !normalized || searchable.toLowerCase().includes(normalized);
  const showEdit = !normalized || blockMatches(editBlock, normalized);
  const showConfirm = !normalized || blockMatches(confirmBlock, normalized);
  const showManage = !normalized || sectionMatches(manageBlock, normalized);
  const hasAny = showEdit || showConfirm || showManage;

  return (
    <section className="flex w-full flex-col gap-6 rounded-3xl border border-transparent min-[720px]:gap-8 dark:border-auth-input-border dark:bg-app-card dark:p-6">
      <div className="flex flex-col gap-3 min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between min-[720px]:gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-7 w-1.5 shrink-0 rounded-full bg-warning"
          />
          <h2 className="text-xl font-bold leading-8 text-content dark:text-primary-100">
            {t('title')}
          </h2>
        </div>

        <SearchField
          label={t('searchAria')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          containerClassName="w-full min-[720px]:ms-auto min-[720px]:max-w-[280px]"
        />
      </div>

      {!matchesSearch || !hasAny ? (
        <p className="text-sm text-app-filter-muted dark:text-app-filter-muted">{t('emptySearch')}</p>
      ) : (
        <div className="flex flex-col gap-5 min-[720px]:gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold leading-7 text-content min-[720px]:text-lg dark:text-app-filter-ink">
              {t('subsectionFields')}
            </h3>
            <p className="text-justify text-sm font-medium leading-7 text-app-filter-muted dark:text-app-filter-ink">
              {content.fieldsIntro}
            </p>
          </div>

          <Accordion type="multiple" className="flex flex-col gap-1 dark:divide-y dark:divide-auth-input-border">
            {showEdit ? (
              <AccordionItem value={editBlock.id}>
                <AccordionTrigger className="py-3 text-base font-bold">
                  {editBlock.title}
                </AccordionTrigger>
                <AccordionContent>
                  <AccordionBody block={editBlock} />
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {showConfirm ? (
              <AccordionItem value={confirmBlock.id}>
                <AccordionTrigger className="py-3 text-base font-bold">
                  {confirmBlock.title}
                </AccordionTrigger>
                <AccordionContent>
                  <AccordionBody block={confirmBlock} />
                </AccordionContent>
              </AccordionItem>
            ) : null}
          </Accordion>

          {showManage ? (
            <div className="flex flex-col gap-3 pt-1 min-[720px]:gap-4">
              <h3 className="text-base font-bold leading-7 text-content dark:text-app-filter-ink">
                {manageBlock.title}
              </h3>
              <div className="flex flex-col gap-3 text-justify text-sm font-medium leading-7 text-app-filter-muted dark:text-app-filter-ink">
                {manageBlock.paragraphs.map((p) => (
                  <p key={p}>{highlightQuotes(p)}</p>
                ))}
                {manageBlock.bullets?.length ? (
                  <ul className="list-disc space-y-2 pe-5 marker:text-app-filter-muted">
                    {manageBlock.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function AccordionBody({ block }: { block: GuideAccordionBlock }) {
  return (
    <div className="flex flex-col gap-4 text-justify text-sm font-medium leading-7 text-app-filter-muted dark:text-app-filter-ink">
      {block.intro.map((p) => (
        <p key={p}>{p}</p>
      ))}

      {block.categoriesLead ? <p>{block.categoriesLead}</p> : null}

      {block.categories?.map((category, categoryIndex) => (
        <div
          key={`${category.title}-${categoryIndex}`}
          className="flex flex-col gap-3"
        >
          <h4 className="font-bold text-content dark:text-app-filter-ink">
            {category.title}
          </h4>
          {category.paragraphs?.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {category.subsections?.map((sub) => (
            <div key={sub.title} className="flex flex-col gap-2 ps-1">
              <h5 className="font-semibold text-content dark:text-app-filter-ink">
                {sub.title}
              </h5>
              {sub.paragraphs?.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {sub.bullets?.length ? (
                <ul className="list-disc space-y-1.5 pe-5 marker:text-app-filter-muted">
                  {sub.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
          {category.bullets?.length ? (
            <ul className="list-disc space-y-1.5 pe-5 marker:text-app-filter-muted">
              {category.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}

      {block.outro?.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/** Highlight «…» captions in manage copy to match design accent. */
function highlightQuotes(text: string): ReactNode {
  const parts = text.split(/(«[^»]+»)/g);
  if (parts.length === 1) return text;

  return parts.map((part, index) =>
    part.startsWith('«') && part.endsWith('»') ? (
      <span key={`${part}-${index}`} className="font-semibold text-warning">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}

function blockMatches(block: GuideAccordionBlock, q: string) {
  const hay = [
    block.title,
    ...block.intro,
    block.categoriesLead ?? '',
    ...(block.categories ?? []).flatMap((c) => [
      c.title,
      ...(c.paragraphs ?? []),
      ...(c.bullets ?? []),
      ...(c.subsections ?? []).flatMap((sub) => [
        sub.title,
        ...(sub.paragraphs ?? []),
        ...(sub.bullets ?? []),
      ]),
    ]),
    ...(block.outro ?? []),
  ]
    .join('\n')
    .toLowerCase();
  return hay.includes(q);
}

function sectionMatches(block: GuideSectionBlock, q: string) {
  const hay = [block.title, ...block.paragraphs, ...(block.bullets ?? [])]
    .join('\n')
    .toLowerCase();
  return hay.includes(q);
}
