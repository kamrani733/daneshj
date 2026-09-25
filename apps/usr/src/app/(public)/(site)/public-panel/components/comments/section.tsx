'use client';

import { ArrowUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';

import {
  type CommentKind,
  type CommentSort,
  type PanelComment,
} from '@public-panel/types/ui';
import {
  appendReply,
  filterAndSortComments,
} from '@public-panel/utils/comments';
import type { PublicPanelCapabilities } from '@public-panel/capabilities';
import { EmptyState } from '@/components/panel';
import { Badge } from '@/components/ui/badge';
import { GuestPromptState } from '@/components/ui/guest-prompt-state';
import { Button } from '@/components/ui/button';
import { SearchField } from '@/components/ui/search-field';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { CommentCard } from '@public-panel/components/comments/card';
import { SectionTitle } from '@public-panel/components/shared/section-title';

const COMMENT_MAX_LENGTH = 1500;

type CommentsSectionProps = {
  username: string;
  comments: PanelComment[];
  accessToken?: string | null;
  viewerActorId?: number | null;
  capabilities: PublicPanelCapabilities;
};

/** Comments composer and transferred / registered panels. */
export function CommentsSection({
  username,
  comments: initialComments,
  accessToken,
  viewerActorId,
  capabilities,
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
            className="size-2 shrink-0 rounded-full bg-app-filter-ink/80"
            aria-hidden
          />
          <p className="text-start text-sm font-medium leading-5 text-app-filter-ink">
            {t('intro', { username })}
          </p>
        </div>

        {capabilities.commentComposerMode === 'guestPrompt' ? (
          <GuestPromptState
            message={t('guestPrompt')}
            loginLabel={t('guestLogin')}
          />
        ) : null}
        {capabilities.commentComposerMode === 'composer' ? (
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
                    'w-full resize-none rounded-xl border bg-app-stat-card px-3 py-3 text-start text-xs font-medium leading-5 text-app-filter-ink',
                    'shadow-[0_2px_6px_2px_rgba(0,0,0,0.15),0_1px_2px_0_rgba(0,0,0,0.3)]',
                    'placeholder:text-neutral-600 focus-visible:outline-none',
                    'dark:border-border dark:bg-app-stat-card dark:text-app-filter-ink dark:placeholder:text-app-filter-muted',
                    expanded
                      ? 'border-primary pb-8 focus-visible:ring-0 dark:border-primary-100'
                      : 'border-border focus-visible:ring-2 focus-visible:ring-primary/30'
                  )}
                />
                {expanded ? (
                  <span className="pointer-events-none absolute bottom-3 end-3 text-[11px] leading-4 text-neutral-600 dark:text-app-filter-muted">
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
        ) : null}

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
          capabilities={capabilities}
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
          capabilities={capabilities}
          onTransfer={handleTransfer}
          onDelete={handleDelete}
          onEditNote={handleEditNote}
          onReply={handleReply}
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
  transferredCount,
  accessToken,
  viewerActorId,
  capabilities,
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
  capabilities: PublicPanelCapabilities;
  onTransfer?: (commentId: string, note: string) => void;
  onDelete?: (commentId: string) => void;
  onEditNote?: (commentId: string, note: string) => void;
  onReply?: (commentId: string, body: string) => void;
}) {
  const t = useTranslations('publicPanel.comments');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<CommentSort>('newest');

  const filtered = useMemo(() => {
    return filterAndSortComments(comments, query, sort);
  }, [comments, query, sort]);

  return (
    <section className="flex w-full flex-col gap-8 rounded-2xl bg-app-stat-card p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)]">
      <header className="flex w-full items-center justify-between gap-3">
        <h3 className="text-start text-lg font-bold text-app-filter-ink">
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
              'h-12 w-[176px] appearance-none rounded-full border border-border bg-transparent py-1.5 pe-3 ps-10 text-start text-sm font-medium text-app-filter-muted',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              'dark:border-border dark:text-app-filter-ink'
            )}
          >
            <option value="newest">{t('sort.newest')}</option>
            <option value="oldest">{t('sort.oldest')}</option>
            <option value="mostLiked">{t('sort.mostLiked')}</option>
          </select>
          <ArrowUpDown
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-app-filter-muted"
            aria-hidden
          />
        </label>

        <SearchField
          label={searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          containerClassName="max-w-[280px] shrink"
        />
      </div>

      <div className="h-px w-full bg-app-search-category dark:bg-border" aria-hidden />

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
                capabilities={capabilities}
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
