'use client';

import { ArrowUpDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import {
  type CommentKind,
  type CommentSort,
  type PanelComment,
} from '@public-panel/data/public-panel-ui';
import { Input } from '@/components/ui/input';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { CommentCard } from './card';
import { EmptyState } from '../shared/empty-state';
import { SectionTitle } from '../shared/section-title';

type CommentsSectionProps = {
  username: string;
  comments: PanelComment[];
  accessToken?: string | null;
  viewerActorId?: number | null;
};

/** Comments composer and transferred / registered panels. */
export function CommentsSection({
  username,
  comments,
  accessToken,
  viewerActorId,
}: CommentsSectionProps) {
  const t = useTranslations('publicPanel.comments');
  const [draft, setDraft] = useState('');

  const transferred = comments.filter((c) => c.kind === 'transferred');
  const registered = comments.filter((c) => c.kind === 'registered');

  return (
    <section
      dir="rtl"
      className="mx-auto flex w-full max-w-[1216px] flex-col items-center gap-8"
    >
      <SectionTitle title={t('title')} className="mx-auto" />

      <div className="flex w-full flex-col items-stretch gap-6">
        <div className="flex w-full items-center justify-start gap-3">
          <span
            className="size-2 shrink-0 rounded-full bg-[#171D19]/80"
            aria-hidden
          />
          <p className="text-start text-sm font-medium leading-5 text-[#171D19]">
            {t('intro', { username })}
          </p>
        </div>

        <div className="flex w-full items-start gap-4">
          <div className="flex size-[41px] shrink-0 items-center justify-center rounded-full bg-[#BFC9C1] text-[13px] font-bold text-white">
            SA
          </div>
          <label className="min-w-0 flex-1">
            <span className="sr-only">{t('placeholder')}</span>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t('placeholder')}
              rows={2}
              className={cn(
                'w-full resize-none rounded-xl border border-[#BFC9C1] bg-white px-3 py-3 text-start text-xs font-medium leading-5 text-[#171D19]',
                'shadow-[0_2px_6px_2px_rgba(0,0,0,0.15),0_1px_2px_0_rgba(0,0,0,0.3)]',
                'placeholder:text-[#707973] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
              )}
            />
          </label>
        </div>

        <CommentListPanel
          kind="transferred"
          title={t('transferred')}
          badge={t('transferredBadge', {
            count: formatFaNumber(transferred.length),
          })}
          searchPlaceholder={t('searchTransferred')}
          emptyMessage={t('emptyTransferred')}
          comments={transferred}
          accessToken={accessToken}
          viewerActorId={viewerActorId}
        />

        <CommentListPanel
          kind="registered"
          title={t('registered')}
          badge={t('registeredBadge', {
            count: formatFaNumber(registered.length),
          })}
          searchPlaceholder={t('searchRegistered')}
          emptyMessage={t('emptyRegistered')}
          comments={registered}
          accessToken={accessToken}
          viewerActorId={viewerActorId}
        />
      </div>
    </section>
  );
}

function CommentListPanel({
  kind,
  title,
  badge,
  searchPlaceholder,
  emptyMessage,
  comments,
  accessToken,
  viewerActorId,
}: {
  kind: CommentKind;
  title: string;
  badge: string;
  searchPlaceholder: string;
  emptyMessage: string;
  comments: PanelComment[];
  accessToken?: string | null;
  viewerActorId?: number | null;
}) {
  const t = useTranslations('publicPanel.comments');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<CommentSort>('newest');

  const filtered = useMemo(() => {
    const q = query.trim();
    let list = comments;
    if (q) {
      list = list.filter(
        (c) =>
          c.body.includes(q) ||
          c.authorName.includes(q) ||
          c.authorHandle.includes(q) ||
          c.quoteNote?.includes(q) ||
          c.originalAuthorName?.includes(q)
      );
    }
    const sorted = [...list];
    if (sort === 'oldest') sorted.reverse();
    if (sort === 'mostLiked') {
      sorted.sort((a, b) => b.likes - a.likes);
    }
    return sorted;
  }, [comments, query, sort]);

  return (
    <section className="flex w-full flex-col gap-8 rounded-2xl bg-white p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)]">
      <header className="flex w-full items-center justify-between gap-3">
        <h3 className="text-start text-lg font-bold text-[#171D19]">{title}</h3>
        <span className="inline-flex items-center justify-center rounded-[30px] bg-[#D3F4E1] px-3 py-1 text-sm font-medium text-[#005138]">
          {badge}
        </span>
      </header>

      <div className="flex w-full items-center justify-between gap-3">
        <label className="relative shrink-0">
          <span className="sr-only">{t('sortLabel')}</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as CommentSort)}
            className={cn(
              'h-12 w-[176px] appearance-none rounded-full border border-[#BFC9C1] bg-transparent py-1.5 pe-3 ps-10 text-start text-sm font-medium text-[#404943]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
            )}
          >
            <option value="newest">{t('sort.newest')}</option>
            <option value="oldest">{t('sort.oldest')}</option>
            <option value="mostLiked">{t('sort.mostLiked')}</option>
          </select>
          <ArrowUpDown
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#404943]"
            aria-hidden
          />
        </label>

        <label className="relative block w-full max-w-[280px] shrink">
          <span className="sr-only">{searchPlaceholder}</span>
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#404943]"
            strokeWidth={1.5}
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 rounded-full border-0 bg-[#F8F8F0] pe-3 ps-9 text-start text-sm text-[#404943] shadow-none placeholder:text-[#404943] focus-visible:ring-0"
          />
        </label>
      </div>

      <div className="h-px w-full bg-[#F1EFE9]" aria-hidden />

      {filtered.length === 0 ? (
        <EmptyState
          message={emptyMessage}
          imageSrc="/images/public-panel/empty-state-alt.png"
          className="min-h-[180px] bg-transparent shadow-none"
        />
      ) : (
        <ul className="flex flex-col gap-4" data-kind={kind}>
          {filtered.map((comment) => (
            <li key={comment.id}>
              <CommentCard
                comment={comment}
                accessToken={accessToken}
                viewerActorId={viewerActorId}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
