'use client';

import { ArrowUpDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';

import {
  type CommentKind,
  type CommentSort,
  type PanelComment,
} from '@public-panel/data/public-panel-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { CommentCard } from './card';
import { EmptyState } from '../shared/empty-state';
import { SectionTitle } from '../shared/section-title';

const COMMENT_MAX_LENGTH = 1500;

type CommentsSectionProps = {
  username: string;
  comments: PanelComment[];
  accessToken?: string | null;
  viewerActorId?: number | null;
};

/** Comments composer and transferred / registered panels. */
export function CommentsSection({
  username,
  comments: initialComments,
  accessToken,
  viewerActorId,
}: CommentsSectionProps) {
  const t = useTranslations('publicPanel.comments');
  const tFlow = useTranslations('publicPanel.comments.transferFlow');
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState('');
  const [expanded, setExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const transferred = comments.filter((c) => c.kind === 'transferred');
  const registered = comments.filter((c) => c.kind === 'registered');
  const transferredCount = transferred.length;

  const handleTransfer = (commentId: string, note: string) => {
    setComments((prev) => {
      const source = prev.find((c) => c.id === commentId);
      if (!source || source.kind !== 'registered') return prev;

      const transferredComment: PanelComment = {
        ...source,
        id: `t-${source.id}-${Date.now()}`,
        kind: 'transferred',
        featured: false,
        authorName: tFlow('ownerName'),
        authorHandle: tFlow('ownerHandle'),
        authorAvatar: '/images/public-panel/avatar.png',
        quoteNote: note || undefined,
        originalAuthorName: source.authorName,
        originalAuthorHandle: source.authorHandle,
        statusLabel: t('badgeTransferred'),
        replies: undefined,
      };

      return [
        transferredComment,
        ...prev.filter((c) => c.id !== commentId),
      ];
    });
  };

  const handleDelete = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleEditNote = (commentId: string, note: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId && c.kind === 'transferred'
          ? { ...c, quoteNote: note || undefined }
          : c
      )
    );
  };

  const handleReply = (commentId: string, body: string) => {
    const reply: PanelComment = {
      id: `reply-${Date.now()}`,
      authorName: tFlow('ownerName'),
      authorHandle: tFlow('ownerHandle'),
      authorAvatar: '/images/public-panel/avatar.png',
      body,
      createdAt: new Intl.DateTimeFormat('fa-IR').format(new Date()),
      kind: 'registered',
      likes: 0,
      dislikes: 0,
      shares: 0,
    };

    setComments((prev) => appendReply(prev, commentId, reply));
  };

  const handleCancel = () => {
    setDraft('');
    setExpanded(false);
    textareaRef.current?.blur();
  };

  const handleSubmit = () => {
    const value = draft.trim();
    if (!value) return;
    // Wire to create-comment API when available.
    setDraft('');
    setExpanded(false);
    textareaRef.current?.blur();
  };

  return (
    <section
      dir="rtl"
      className="mx-auto flex w-full max-w-[1216px] flex-col items-center gap-8"
    >
      <SectionTitle title={t('title')} className="mx-auto" />

      <div className="flex w-full flex-col items-stretch gap-6">
        <div className="flex w-full items-center justify-start gap-3">
          <span
            className="size-2 shrink-0 rounded-full bg-home-filter-ink/80"
            aria-hidden
          />
          <p className="text-start text-sm font-medium leading-5 text-home-filter-ink">
            {t('intro', { username })}
          </p>
        </div>

        <div className="flex w-full items-start gap-4">
          <div className="flex size-[41px] shrink-0 items-center justify-center rounded-full bg-border text-[13px] font-bold text-white">
            SA
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <label className="relative block w-full">
              <span className="sr-only">{t('placeholder')}</span>
              <textarea
                ref={textareaRef}
                value={draft}
                maxLength={COMMENT_MAX_LENGTH}
                onChange={(event) => setDraft(event.target.value)}
                onFocus={() => setExpanded(true)}
                placeholder={t('placeholder')}
                rows={expanded ? 4 : 2}
                className={cn(
                  'w-full resize-none rounded-xl border bg-home-stat-card px-3 py-3 text-start text-xs font-medium leading-5 text-home-filter-ink',
                  'shadow-[0_2px_6px_2px_rgba(0,0,0,0.15),0_1px_2px_0_rgba(0,0,0,0.3)]',
                  'placeholder:text-neutral-600 focus-visible:outline-none',
                  'dark:border-border dark:bg-home-stat-card dark:text-home-filter-ink dark:placeholder:text-home-filter-muted',
                  expanded
                    ? 'border-primary pb-8 focus-visible:ring-0 dark:border-primary-100'
                    : 'border-border focus-visible:ring-2 focus-visible:ring-primary/30'
                )}
              />
              {expanded ? (
                <span className="pointer-events-none absolute bottom-3 end-3 text-[11px] leading-4 text-neutral-600 dark:text-home-filter-muted">
                  {t('charCount', {
                    count: formatFaNumber(draft.length),
                    max: formatFaNumber(COMMENT_MAX_LENGTH),
                  })}
                </span>
              ) : null}
            </label>

            {expanded ? (
              <div dir="ltr" className="flex items-center gap-3">
                <Button
                  type="button"
                  size="pillSm"
                  disabled={!draft.trim()}
                  onClick={handleSubmit}
                  className="rounded-lg dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-100/90"
                >
                  {t('submit')}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleCancel}
                  className="h-auto px-0 text-sm font-medium text-primary dark:text-primary-100"
                >
                  {t('cancel')}
                </Button>
              </div>
            ) : null}
          </div>
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
          transferredCount={transferredCount}
          accessToken={accessToken}
          viewerActorId={viewerActorId}
          onTransfer={handleTransfer}
          onDelete={handleDelete}
          onEditNote={handleEditNote}
          onReply={handleReply}
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
          transferredCount={transferredCount}
          accessToken={accessToken}
          viewerActorId={viewerActorId}
          onTransfer={handleTransfer}
          onDelete={handleDelete}
          onEditNote={handleEditNote}
          onReply={handleReply}
        />
      </div>
    </section>
  );
}

function appendReply(
  comments: PanelComment[],
  commentId: string,
  reply: PanelComment
): PanelComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return {
        ...comment,
        replies: [...(comment.replies ?? []), { ...reply, replyToName: comment.authorName }],
      };
    }
    if (comment.replies?.length) {
      return {
        ...comment,
        replies: appendReply(comment.replies, commentId, reply),
      };
    }
    return comment;
  });
}

function CommentListPanel({
  kind,
  title,
  badge,
  searchPlaceholder,
  emptyMessage,
  comments,
  transferredCount,
  accessToken,
  viewerActorId,
  onTransfer,
  onDelete,
  onEditNote,
  onReply,
}: {
  kind: CommentKind;
  title: string;
  badge: string;
  searchPlaceholder: string;
  emptyMessage: string;
  comments: PanelComment[];
  transferredCount: number;
  accessToken?: string | null;
  viewerActorId?: number | null;
  onTransfer?: (commentId: string, note: string) => void;
  onDelete?: (commentId: string) => void;
  onEditNote?: (commentId: string, note: string) => void;
  onReply?: (commentId: string, body: string) => void;
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
    <section className="flex w-full flex-col gap-8 rounded-2xl bg-home-stat-card p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)]">
      <header className="flex w-full items-center justify-between gap-3">
        <h3 className="text-start text-lg font-bold text-home-filter-ink">
          {title}
        </h3>
        <Badge className="h-auto rounded-[30px] border-0 bg-primary-subtle px-3 py-1 text-sm font-medium text-primary-700 dark:text-primary-100">
          {badge}
        </Badge>
      </header>

      <div className="flex w-full items-center justify-between gap-3">
        <label className="relative shrink-0">
          <span className="sr-only">{t('sortLabel')}</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as CommentSort)}
            className={cn(
              'h-12 w-[176px] appearance-none rounded-full border border-border bg-transparent py-1.5 pe-3 ps-10 text-start text-sm font-medium text-home-filter-muted',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              'dark:border-border dark:text-home-filter-ink'
            )}
          >
            <option value="newest">{t('sort.newest')}</option>
            <option value="oldest">{t('sort.oldest')}</option>
            <option value="mostLiked">{t('sort.mostLiked')}</option>
          </select>
          <ArrowUpDown
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-home-filter-muted"
            aria-hidden
          />
        </label>

        <label className="relative block w-full max-w-[280px] shrink">
          <span className="sr-only">{searchPlaceholder}</span>
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-home-filter-muted"
            strokeWidth={1.5}
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              'h-10 rounded-full border border-home-filter-ink bg-home-search-fill pe-4 ps-10',
              'text-start text-sm font-medium text-home-filter-muted shadow-none',
              'placeholder:text-home-filter-muted focus-visible:border-home-filter-ink focus-visible:ring-0',
              'dark:border-border dark:bg-home-search-category dark:text-home-filter-ink',
              'dark:placeholder:text-home-filter-muted dark:focus-visible:border-border'
            )}
          />
        </label>
      </div>

      <div className="h-px w-full bg-home-search-category dark:bg-border" aria-hidden />

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
                transferredCount={transferredCount}
                accessToken={accessToken}
                viewerActorId={viewerActorId}
                onTransfer={onTransfer}
                onDelete={onDelete}
                onEditNote={onEditNote}
                onReply={onReply}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
