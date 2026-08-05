'use client';

import {
  ChevronDown,
  Heart,
  MoreVertical,
  Repeat2,
  Reply,
  Star,
  ThumbsDown,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

import {
  ACTOR_TYPE,
  LIKE_STATUS,
  TARGET_TYPE,
  useLikeMutation,
} from '@public-panel/api';
import type { PanelComment } from '@public-panel/data/public-panel-ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { CommentTransferFlow, CommentConfirmDialog } from './transfer-flow';

const REPLY_MAX_LENGTH = 1500;

type CommentCardProps = {
  comment: PanelComment;
  className?: string;
  nested?: boolean;
  transferredCount?: number;
  accessToken?: string | null;
  viewerActorId?: number | null;
  onTransfer?: (commentId: string, note: string) => void;
  onDelete?: (commentId: string) => void;
  onEditNote?: (commentId: string, note: string) => void;
  onReply?: (commentId: string, body: string) => void;
};

/** Comment thread item with actions and nested replies. */
export function CommentCard({
  comment,
  className,
  nested = false,
  transferredCount = 0,
  accessToken,
  viewerActorId,
  onTransfer,
  onDelete,
  onEditNote,
  onReply,
}: CommentCardProps) {
  const t = useTranslations('publicPanel.comments');
  const tFlow = useTranslations('publicPanel.comments.transferFlow');
  const replies = comment.replies ?? [];
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyDraft, setReplyDraft] = useState('');
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);
  const shares = comment.shares;
  const [reaction, setReaction] = useState<'like' | 'dislike' | 'none'>('none');
  const [featured, setFeatured] = useState(Boolean(comment.featured));
  const [transferOpen, setTransferOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const isTransferred = comment.kind === 'transferred';

  useEffect(() => {
    if (replying) replyRef.current?.focus();
  }, [replying]);

  const likeMutation = useLikeMutation();

  const targetId = Number.parseInt(comment.id.replace(/\D/g, ''), 10);
  const canInteract =
    !!accessToken &&
    viewerActorId != null &&
    viewerActorId > 0 &&
    Number.isFinite(targetId);

  async function handleReaction(next: 'like' | 'dislike') {
    const previous = reaction;
    const previousLikes = likes;
    const previousDislikes = dislikes;

    const likeStatus =
      reaction === next
        ? LIKE_STATUS.none
        : next === 'like'
          ? LIKE_STATUS.like
          : LIKE_STATUS.dislike;

    setReaction(
      likeStatus === LIKE_STATUS.none
        ? 'none'
        : likeStatus === LIKE_STATUS.like
          ? 'like'
          : 'dislike'
    );

    if (previous === 'like') setLikes((value) => Math.max(0, value - 1));
    if (previous === 'dislike') setDislikes((value) => Math.max(0, value - 1));
    if (likeStatus === LIKE_STATUS.like) setLikes((value) => value + 1);
    if (likeStatus === LIKE_STATUS.dislike) setDislikes((value) => value + 1);

    if (!canInteract || !viewerActorId || !accessToken) return;

    try {
      await likeMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE.user,
        actorId: viewerActorId,
        targetType: TARGET_TYPE.comment,
        targetId,
        likeStatus,
      });
    } catch {
      setReaction(previous);
      setLikes(previousLikes);
      setDislikes(previousDislikes);
    }
  }

  const closeReply = () => {
    setReplyDraft('');
    setReplying(false);
  };

  const submitReply = () => {
    const value = replyDraft.trim();
    if (!value) return;
    onReply?.(comment.id, value);
    closeReply();
    setShowReplies(true);
  };

  const replyComposer = replying ? (
    <ReplyComposer
      draft={replyDraft}
      maxLength={REPLY_MAX_LENGTH}
      textareaRef={replyRef}
      onChange={setReplyDraft}
      onSubmit={submitReply}
      onCancel={closeReply}
      labels={{
        placeholder: t('replyPlaceholder'),
        submit: t('submit'),
        cancel: t('cancel'),
        charCount: t('charCount', {
          count: formatFaNumber(replyDraft.length),
          max: formatFaNumber(REPLY_MAX_LENGTH),
        }),
      }}
    />
  ) : null;

  const interaction = (
    <InteractionRow
      likes={likes}
      dislikes={dislikes}
      shares={shares}
      reaction={reaction}
      featured={featured}
      disabled={likeMutation.isPending}
      transferDisabled={isTransferred}
      onLike={() => void handleReaction('like')}
      onDislike={() => void handleReaction('dislike')}
      onTransfer={() => setTransferOpen(true)}
      onReply={() => setReplying((value) => !value)}
      onToggleFeature={() => setFeatured((value) => !value)}
      labels={{
        feature: t('feature'),
        unfeature: t('unfeature'),
        reply: t('reply'),
        transfer: t('transfer'),
        dislike: t('dislike'),
        like: t('like'),
        more: t('more'),
      }}
    />
  );

  if (isTransferred && !nested) {
    return (
      <article
        className={cn(
          'relative flex flex-col items-stretch gap-3 rounded-xl bg-home-stat-card p-4 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]',
          className
        )}
      >
        <div className="absolute end-3 top-3">
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={t('more')}
                className="text-neutral-600 hover:text-home-filter-ink dark:text-home-filter-muted dark:hover:text-home-filter-ink"
              >
                <MoreVertical className="size-5" strokeWidth={1.5} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={6}
              dir="rtl"
              className="w-[240px] gap-0 rounded-xl border-0 bg-home-search-fill p-1 shadow-home-elevation-2 ring-0 dark:bg-home-search-category"
            >
              <ul className="flex flex-col py-1">
                <li>
                  <button
                    type="button"
                    className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-home-filter-ink hover:bg-black/[0.04] dark:hover:bg-white/10"
                    onClick={() => {
                      setMenuOpen(false);
                      setDeleteOpen(true);
                    }}
                  >
                    {tFlow('menuDelete')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-home-filter-ink hover:bg-black/[0.04] dark:hover:bg-white/10"
                    onClick={() => {
                      setMenuOpen(false);
                      setEditOpen(true);
                    }}
                  >
                    {tFlow('menuEditNote')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-home-filter-ink hover:bg-black/[0.04] dark:hover:bg-white/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    {tFlow('menuReport')}
                  </button>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>

        <CommentConfirmDialog
          open={deleteOpen}
          title={tFlow('revertTitle')}
          primaryLabel={tFlow('yes')}
          secondaryLabel={tFlow('no')}
          textActions
          onPrimary={() => {
            onDelete?.(comment.id);
            setDeleteOpen(false);
            setDeleteSuccessOpen(true);
          }}
          onSecondary={() => setDeleteOpen(false)}
        />

        <CommentConfirmDialog
          open={deleteSuccessOpen}
          title={tFlow('deleteSuccess')}
          primaryLabel={tFlow('close')}
          textActions
          singleAction
          onPrimary={() => setDeleteSuccessOpen(false)}
        />

        <CommentTransferFlow
          comment={comment}
          transferredCount={transferredCount}
          open={editOpen}
          initialNote={comment.quoteNote ?? ''}
          mode="edit"
          onOpenChange={setEditOpen}
          onConfirmTransfer={(note) => {
            onEditNote?.(comment.id, note);
          }}
        />

        <header className="flex items-center gap-3 pe-6">
          <Avatar className="size-12 shrink-0 ring-2 ring-primary dark:ring-primary-100">
            {comment.authorAvatar ? (
              <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
            ) : null}
            <AvatarFallback className="bg-home-stat-card text-base font-bold text-home-filter-ink dark:bg-home-search-category">
              {comment.authorName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col items-start gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-home-filter-ink">
                {comment.authorName}
              </h4>
              <span className="text-xs text-neutral-600 dark:text-home-filter-muted">
                @{comment.authorHandle}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-home-filter-muted">
              {comment.timeLabel ? <span>{comment.timeLabel}</span> : null}
              <span>{comment.createdAt}</span>
              <span aria-hidden>•</span>
              {comment.statusLabel ? <span>{comment.statusLabel}</span> : null}
            </div>
          </div>
        </header>

        {comment.quoteNote ? (
          <p className="w-full text-start text-sm leading-normal text-home-filter-ink">
            &quot;{comment.quoteNote}&quot;
          </p>
        ) : null}

        <div className="w-full rounded-xl border border-primary bg-primary/10 p-4 dark:border-primary-100">
          <div className="flex flex-col items-stretch gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-600 text-[12.8px] font-bold text-white">
                {(comment.originalAuthorName ?? comment.authorName).slice(0, 2)}
              </div>
              <span className="text-sm font-bold text-home-filter-ink">
                {comment.originalAuthorName ?? comment.authorName} @
                {comment.originalAuthorHandle ?? comment.authorHandle}
              </span>
            </div>
            <p className="w-full text-start text-sm leading-[1.5] text-home-filter-ink">
              {comment.body}
            </p>
          </div>
        </div>

        {interaction}
        {replyComposer}
      </article>
    );
  }

  return (
    <article
      className={cn(
        'relative rounded-xl p-4 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]',
        featured
          ? 'border-s-[3px] border-s-warning bg-warning-10 dark:bg-surface-dark'
          : nested
            ? 'bg-home-search-fill dark:bg-home-search-category'
            : 'bg-home-stat-card',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-12 shrink-0 bg-border">
          {comment.authorAvatar ? (
            <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
          ) : null}
          <AvatarFallback className="bg-border text-base font-bold text-white">
            {comment.authorName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <header className="flex w-full items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-home-filter-ink">
                {comment.authorName}
              </h4>
              <span className="text-xs font-medium text-neutral-600 dark:text-home-filter-muted">
                @{comment.authorHandle}
              </span>
              <span className="text-xs font-medium text-neutral-600 dark:text-home-filter-muted">
                {comment.createdAt}
              </span>
              <span className="text-neutral-600 dark:text-home-filter-muted" aria-hidden>
                •
              </span>
              {comment.timeLabel ? (
                <span className="text-xs font-medium text-neutral-600 dark:text-home-filter-muted">
                  {comment.timeLabel}
                </span>
              ) : null}
              {featured ? (
                <Badge className="h-auto gap-1 border-0 bg-transparent px-0 text-xs font-bold text-warning">
                  <Star className="size-3.5 fill-warning text-warning" />
                  {t('badgeFeatured')}
                </Badge>
              ) : null}
            </div>
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={t('more')}
                  className="shrink-0 text-neutral-600 hover:text-home-filter-ink dark:text-home-filter-muted dark:hover:text-home-filter-ink"
                >
                  <MoreVertical className="size-5" strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={6}
                dir="rtl"
                className="w-[240px] gap-0 rounded-xl border-0 bg-home-search-fill p-1 shadow-home-elevation-2 ring-0 dark:bg-home-search-category"
              >
                <ul className="flex flex-col py-1">
                  <li>
                    <button
                      type="button"
                      className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-home-filter-ink hover:bg-black/[0.04] dark:hover:bg-white/10"
                      onClick={() => {
                        setMenuOpen(false);
                        setDeleteOpen(true);
                      }}
                    >
                      {tFlow('menuDeleteRegistered')}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-home-filter-ink hover:bg-black/[0.04] dark:hover:bg-white/10"
                      onClick={() => {
                        setMenuOpen(false);
                        setTransferOpen(true);
                      }}
                    >
                      {tFlow('menuEditNote')}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-home-filter-ink hover:bg-black/[0.04] dark:hover:bg-white/10"
                      onClick={() => setMenuOpen(false)}
                    >
                      {tFlow('menuReport')}
                    </button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </header>

          <p className="w-full text-start text-sm font-medium leading-5 text-home-filter-ink">
            {comment.body}
          </p>

          <div className="h-px w-full bg-home-search-category dark:bg-border" aria-hidden />

          {interaction}

          {!nested && replies.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowReplies((v) => !v)}
              className="inline-flex h-9 w-fit items-center gap-1 rounded-full border border-border px-3 text-sm font-medium text-home-filter-muted dark:border-border dark:text-home-filter-ink"
            >
              <ChevronDown
                className={cn(
                  'size-4 transition-transform',
                  showReplies && 'rotate-180'
                )}
                aria-hidden
              />
              {showReplies
                ? t('hideReplies', { count: formatFaNumber(replies.length) })
                : t('showReplies', { count: formatFaNumber(replies.length) })}
            </button>
          ) : null}

          {replyComposer}

          {!nested && showReplies && replies.length > 0 ? (
            <div className="flex w-full flex-col items-stretch gap-3">
              {replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  nested
                  transferredCount={transferredCount}
                  accessToken={accessToken}
                  viewerActorId={viewerActorId}
                  onTransfer={onTransfer}
                  onDelete={onDelete}
                  onEditNote={onEditNote}
                  onReply={onReply}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <CommentConfirmDialog
        open={deleteOpen}
        title={tFlow('deleteTitle')}
        primaryLabel={tFlow('yes')}
        secondaryLabel={tFlow('no')}
        textActions
        onPrimary={() => {
          onDelete?.(comment.id);
          setDeleteOpen(false);
          setDeleteSuccessOpen(true);
        }}
        onSecondary={() => setDeleteOpen(false)}
      />

      <CommentConfirmDialog
        open={deleteSuccessOpen}
        title={tFlow('deleteSuccess')}
        primaryLabel={tFlow('close')}
        textActions
        singleAction
        onPrimary={() => setDeleteSuccessOpen(false)}
      />

      <CommentTransferFlow
        comment={comment}
        transferredCount={transferredCount}
        open={transferOpen}
        onOpenChange={setTransferOpen}
        onConfirmTransfer={(note) => {
          onTransfer?.(comment.id, note);
        }}
      />
    </article>
  );
}

function InteractionRow({
  likes,
  dislikes,
  shares,
  reaction,
  featured,
  disabled,
  transferDisabled,
  onLike,
  onDislike,
  onTransfer,
  onReply,
  onToggleFeature,
  labels,
}: {
  likes: number;
  dislikes: number;
  shares: number;
  reaction: 'like' | 'dislike' | 'none';
  featured: boolean;
  disabled?: boolean;
  transferDisabled?: boolean;
  onLike: () => void;
  onDislike: () => void;
  onTransfer: () => void;
  onReply: () => void;
  onToggleFeature: () => void;
  labels: {
    feature: string;
    unfeature: string;
    reply: string;
    transfer: string;
    dislike: string;
    like: string;
    more: string;
  };
}) {
  const liked = reaction === 'like';

  return (
    <div className="flex w-full justify-end">
      <div
        dir="rtl"
        className="flex flex-wrap items-center gap-1 text-neutral-600 dark:text-home-filter-muted"
      >
        <ActionButton
          label={labels.like}
          count={likes}
          active={liked}
          activeClassName="text-destructive"
          disabled={disabled}
          onClick={onLike}
          icon={
            <Heart
              className="size-5"
              fill="none"
              strokeWidth={1.5}
            />
          }
        />
        <ActionButton
          label={labels.dislike}
          count={dislikes}
          active={reaction === 'dislike'}
          disabled={disabled}
          onClick={onDislike}
          icon={<ThumbsDown className="size-5" strokeWidth={1.5} />}
        />
        <ActionButton
          label={labels.transfer}
          count={shares}
          disabled={transferDisabled}
          onClick={onTransfer}
          icon={<Repeat2 className="size-5" strokeWidth={1.5} />}
        />
        <ActionButton
          label={labels.reply}
          onClick={onReply}
          icon={<Reply className="size-5" strokeWidth={1.5} />}
        />
        <ActionButton
          label={featured ? labels.unfeature : labels.feature}
          active={featured}
          activeClassName="text-warning"
          onClick={onToggleFeature}
          icon={
            <Star
              className={cn('size-5', featured && 'text-warning')}
              strokeWidth={1.5}
            />
          }
        />
      </div>
    </div>
  );
}

function ReplyComposer({
  draft,
  maxLength,
  textareaRef,
  onChange,
  onSubmit,
  onCancel,
  labels,
}: {
  draft: string;
  maxLength: number;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  labels: {
    placeholder: string;
    submit: string;
    cancel: string;
    charCount: string;
  };
}) {
  return (
    <div className="flex w-full items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-border text-xs font-bold text-white">
        s
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <label className="relative block w-full">
          <span className="sr-only">{labels.placeholder}</span>
          <textarea
            ref={textareaRef}
            value={draft}
            maxLength={maxLength}
            onChange={(event) => onChange(event.target.value)}
            placeholder={labels.placeholder}
            rows={4}
            className={cn(
              'w-full resize-none rounded-xl border border-border bg-home-stat-card px-3 pb-8 pt-3',
              'text-start text-xs font-medium leading-5 text-home-filter-ink',
              'placeholder:text-neutral-600 focus-visible:border-primary focus-visible:outline-none',
              'dark:border-border dark:bg-home-search-category dark:text-home-filter-ink',
              'dark:placeholder:text-home-filter-muted dark:focus-visible:border-primary-100'
            )}
          />
          <span className="pointer-events-none absolute bottom-3 end-3 text-[11px] leading-4 text-neutral-600 dark:text-home-filter-muted">
            {labels.charCount}
          </span>
        </label>

        <div dir="ltr" className="flex items-center gap-3">
          <Button
            type="button"
            size="pillSm"
            disabled={!draft.trim()}
            onClick={onSubmit}
            className="rounded-lg dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-100/90"
          >
            {labels.submit}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={onCancel}
            className="h-auto px-0 text-sm font-medium text-primary dark:text-primary-100"
          >
            {labels.cancel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  count,
  icon,
  active,
  className,
  activeClassName = 'text-primary dark:text-primary-100',
  disabled,
  onClick,
}: {
  label: string;
  count?: number;
  icon: ReactNode;
  active?: boolean;
  className?: string;
  activeClassName?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10',
        className,
        active && activeClassName
      )}
    >
      {icon}
      {count != null ? <span>{formatFaNumber(count)}</span> : null}
    </button>
  );
}
