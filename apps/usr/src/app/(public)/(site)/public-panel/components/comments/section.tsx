'use client';

import { ChevronDown, Search, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import {
  COMMENT_MAX_LENGTH,
  type CommentKind,
  type CommentSort,
  type PanelComment,
} from '@public-panel/data/public-panel-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { CommentCard } from './card';
import { EmptyState } from '../shared/empty-state';

type CommentsSectionProps = {
  comments: PanelComment[];
  accessToken?: string | null;
  viewerActorId?: number | null;
};

/**
 * Figma #732:63099 — دیدگاه‌ها
 * Composer + transferred / registered panels with search, sort, threads.
 */
export function CommentsSection({
  comments,
  accessToken,
  viewerActorId,
}: CommentsSectionProps) {
  const t = useTranslations('publicPanel.comments');
  const [draft, setDraft] = useState('');
  const remaining = COMMENT_MAX_LENGTH - draft.length;

  const transferred = comments.filter((c) => c.kind === 'transferred');
  const registered = comments.filter((c) => c.kind === 'registered');

  return (
    <section className="flex w-full flex-col gap-6">
      <h2 className="text-center text-2xl font-bold leading-8 text-primary min-[720px]:text-[28px]">
        {t('title')}
      </h2>

      <form
        className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:bg-home-search-category min-[720px]:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          setDraft('');
        }}
      >
        <div className="flex gap-3">
          <AvatarPlaceholder />
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{t('placeholder')}</span>
            <textarea
              value={draft}
              maxLength={COMMENT_MAX_LENGTH}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t('placeholder')}
              rows={4}
              className={cn(
                'min-h-[120px] w-full resize-y rounded-xl border border-[#D1D5DB] bg-home-search-fill px-4 py-3 text-sm leading-6 text-content',
                'placeholder:text-home-filter-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                'dark:border-border dark:bg-home-card/30'
              )}
            />
            <span className="absolute bottom-3 start-3 text-xs text-home-filter-muted">
              {t('charCount', { count: formatFaNumber(remaining) })}
            </span>
          </label>
        </div>

        <div className="flex items-center justify-start gap-2">
          <Button type="submit" size="pillSm" disabled={!draft.trim()}>
            {t('submit')}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="pillSm"
            onClick={() => setDraft('')}
            className="border-home-filter"
          >
            {t('cancel')}
          </Button>
        </div>
      </form>

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
    </section>
  );
}

function AvatarPlaceholder() {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-home-search-fill text-home-filter-muted ring-1 ring-[#E5E7EB] dark:bg-home-card">
      <User className="size-5" strokeWidth={1.5} aria-hidden />
    </div>
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
          c.authorHandle.includes(q)
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
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:bg-home-search-category min-[720px]:p-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-content">{title}</h3>
        <span className="rounded-full bg-primary-subtle px-3 py-1 text-xs font-medium text-primary">
          {badge}
        </span>
      </header>

      <div className="flex flex-col gap-3 min-[720px]:flex-row min-[720px]:items-center">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">{searchPlaceholder}</span>
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-home-filter-muted"
            strokeWidth={1.5}
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 rounded-full border-[#E5E7EB] bg-home-search-fill pe-4 ps-10 text-sm shadow-none dark:bg-home-card/30"
          />
        </label>

        <label className="relative shrink-0">
          <span className="sr-only">{t('sortLabel')}</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as CommentSort)}
            className={cn(
              'h-11 appearance-none rounded-full border border-[#E5E7EB] bg-home-search-fill py-2 pe-4 ps-10 text-sm text-content',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-home-card/30'
            )}
          >
            <option value="newest">{t('sort.newest')}</option>
            <option value="oldest">{t('sort.oldest')}</option>
            <option value="mostLiked">{t('sort.mostLiked')}</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-home-filter-muted"
            aria-hidden
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          message={emptyMessage}
          imageSrc="/public-panel/empty-state-alt.png"
          className="min-h-[180px] bg-transparent shadow-none"
        />
      ) : (
        <ul className="flex flex-col gap-3" data-kind={kind}>
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
