'use client';

import {
  ChevronDown,
  Heart,
  MoreVertical,
  Repeat2,
  Reply,
  Star,
  StarOff,
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
import {
  isActionVisible,
  type ActionAccess,
  type PublicPanelCapabilities,
} from '@public-panel/capabilities';
import type { PanelComment } from '@public-panel/types/ui';
import { AppDialog } from '@/components/ui/app-dialog';
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

import { CommentTransferFlow } from '@public-panel/components/comments/transfer-flow';
import { useGuardedAction } from '@public-panel/components/shared/guest-access-dialog';

const REPLY_MAX_LENGTH = 1500;

type CommentCardProps = {
  comment: PanelComment;
  className?: string;
  nested?: boolean;
  transferredCount?: number;
  accessToken?: string | null;
  viewerActorId?: number | null;
  capabilities: PublicPanelCapabilities;
  onTransfer?: (commentId: string, note: string) => void;
  onDelete?: (commentId: string) => void;
  onRestore?: (commentId: string) => void;
  onToggleFeature?: (commentId: string) => void;
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
  capabilities,
  onTransfer,
  onDelete,
  onRestore,
  onToggleFeature,
  onEditNote,
  onReply,
}: CommentCardProps) {
  const guard = useGuardedAction();
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
  const featured = Boolean(comment.featured);
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
  const isOwn =
    viewerActorId != null &&
    viewerActorId > 0 &&
    comment.authorActorId === viewerActorId;
  const canDelete = isTransferred
    ? capabilities.manageTransferredComments
    : capabilities.commentDeleteAny || (capabilities.commentDeleteOwn && isOwn);
  const canRestore = capabilities.commentRestore && Boolean(comment.deleted);
  const canEditTransferNote = isTransferred && capabilities.manageTransferredComments;
  const reportAccess = capabilities.commentReport;
  const showMenu =
    (canDelete && !comment.deleted) ||
    canRestore ||
    canEditTransferNote ||
    isActionVisible(reportAccess);
  const canInteract =
    capabilities.commentReactions === 'enabled' &&
    Boolean(accessToken) &&
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
      reactionsAccess={comment.deleted ? 'readonly' : capabilities.commentReactions}
      replyAccess={comment.deleted ? 'hidden' : capabilities.commentReply}
      transferAccess={
        isTransferred || comment.deleted ? 'hidden' : capabilities.commentTransfer
      }
      showFeature={capabilities.commentFeature && !isTransferred && !comment.deleted}
      onLike={() =>
        guard(capabilities.commentReactions, () => void handleReaction('like'))
      }
      onDislike={() =>
        guard(capabilities.commentReactions, () => void handleReaction('dislike'))
      }
      onTransfer={() => guard(capabilities.commentTransfer, () => setTransferOpen(true))}
      onReply={() =>
        guard(capabilities.commentReply, () => setReplying((value) => !value))
      }
      onToggleFeature={() => onToggleFeature?.(comment.id)}
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
          'relative flex flex-col items-stretch gap-3 rounded-xl bg-app-stat-card p-4 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]',
          className
        )}
      >
        {showMenu ? (
          <div className="absolute end-3 top-3">
            <CommentMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
              moreLabel={t('more')}
              items={[
                canDelete && !comment.deleted
                  ? { label: tFlow('menuDelete'), onSelect: () => setDeleteOpen(true) }
                  : null,
                canEditTransferNote
                  ? { label: tFlow('menuEditNote'), onSelect: () => setEditOpen(true) }
                  : null,
                canRestore
                  ? { label: tFlow('menuRestore'), onSelect: () => onRestore?.(comment.id) }
                  : null,
                isActionVisible(reportAccess)
                  ? {
                      label: tFlow('menuReport'),
                      onSelect: () => guard(reportAccess, () => undefined),
                    }
                  : null,
              ]}
            />
          </div>
        ) : null}

        <AppDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          variant="confirm"
          title={tFlow('revertTitle')}
          actionsStyle="text"
          primaryAction={{
            label: tFlow('yes'),
            onClick: () => {
              onDelete?.(comment.id);
              setDeleteOpen(false);
              setDeleteSuccessOpen(true);
            },
          }}
          secondaryAction={{
            label: tFlow('no'),
            onClick: () => setDeleteOpen(false),
          }}
        />

        <AppDialog
          open={deleteSuccessOpen}
          onOpenChange={setDeleteSuccessOpen}
          variant="confirm"
          title={tFlow('deleteSuccess')}
          actionsStyle="text"
          primaryAction={{
            label: tFlow('close'),
            onClick: () => setDeleteSuccessOpen(false),
          }}
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
            <AvatarFallback className="bg-app-stat-card text-base font-bold text-app-filter-ink dark:bg-app-search-category">
              {comment.authorName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col items-start gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-app-filter-ink">
                {comment.authorName}
              </h4>
              <span className="text-xs text-neutral-600 dark:text-app-filter-muted">
                @{comment.authorHandle}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-app-filter-muted">
              {comment.timeLabel ? <span>{comment.timeLabel}</span> : null}
              <span>{comment.createdAt}</span>
              <span aria-hidden>•</span>
              {comment.statusLabel ? <span>{comment.statusLabel}</span> : null}
            </div>
          </div>
        </header>

        {comment.quoteNote ? (
          <p className="w-full text-start text-sm leading-normal text-app-filter-ink">
            &quot;{comment.quoteNote}&quot;
          </p>
        ) : null}

        <div className="w-full rounded-xl border border-primary bg-primary/10 p-4 dark:border-primary-100">
          <div className="flex flex-col items-stretch gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-600 text-[12.8px] font-bold text-white">
                {(comment.originalAuthorName ?? comment.authorName).slice(0, 2)}
              </div>
              <span className="text-sm font-bold text-app-filter-ink">
                {comment.originalAuthorName ?? comment.authorName} @
                {comment.originalAuthorHandle ?? comment.authorHandle}
              </span>
            </div>
            <p className="w-full text-start text-sm leading-[1.5] text-app-filter-ink">
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
        comment.deleted && 'opacity-60',
        featured
          ? 'border-s-[3px] border-s-warning bg-warning-10 dark:bg-surface-dark'
          : nested
            ? 'bg-app-search-fill dark:bg-app-search-category'
            : 'bg-app-stat-card',
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
              <h4 className="text-sm font-bold text-app-filter-ink">
                {comment.authorName}
              </h4>
              <span className="text-xs font-medium text-neutral-600 dark:text-app-filter-muted">
                @{comment.authorHandle}
              </span>
              <span className="text-xs font-medium text-neutral-600 dark:text-app-filter-muted">
                {comment.createdAt}
              </span>
              <span className="text-neutral-600 dark:text-app-filter-muted" aria-hidden>
                •
              </span>
              {comment.timeLabel ? (
                <span className="text-xs font-medium text-neutral-600 dark:text-app-filter-muted">
                  {comment.timeLabel}
                </span>
              ) : null}
              {comment.deleted ? (
                <span className="text-xs font-bold text-error">
                  {t('badgeDeleted')}
                </span>
              ) : null}
              {featured ? (
                <Badge className="h-auto basis-full justify-start gap-1 border-0 bg-transparent px-0 text-xs font-bold text-warning min-[720px]:basis-auto">
                  <Star className="size-3.5 text-warning" strokeWidth={2} />
                  {t('badgeFeatured')}
                </Badge>
              ) : null}
            </div>
            {showMenu ? (
              <CommentMenu
                open={menuOpen}
                onOpenChange={setMenuOpen}
                moreLabel={t('more')}
                items={[
                  canDelete && !comment.deleted
                    ? {
                        label: tFlow('menuDeleteRegistered'),
                        onSelect: () => setDeleteOpen(true),
                      }
                    : null,
                  canRestore
                    ? {
                        label: tFlow('menuRestore'),
                        onSelect: () => onRestore?.(comment.id),
                      }
                    : null,
                  isActionVisible(reportAccess)
                    ? {
                        label: tFlow('menuReport'),
                        onSelect: () => guard(reportAccess, () => undefined),
                      }
                    : null,
                ]}
              />
            ) : null}
          </header>

          <p className="w-full text-start text-sm font-medium leading-5 text-app-filter-ink">
            {comment.body}
          </p>

          <div className="h-px w-full bg-app-search-category dark:bg-border" aria-hidden />

          {interaction}

          {!nested && replies.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowReplies((v) => !v)}
              className="inline-flex h-9 w-fit items-center gap-1 rounded-full border border-border px-3 text-sm font-medium text-app-filter-muted dark:border-border dark:text-app-filter-ink"
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
                  capabilities={capabilities}
                  onTransfer={onTransfer}
                  onDelete={onDelete}
                  onRestore={onRestore}
                  onToggleFeature={onToggleFeature}
                  onEditNote={onEditNote}
                  onReply={onReply}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <AppDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        variant="confirm"
        title={tFlow('deleteTitle')}
        actionsStyle="text"
        primaryAction={{
          label: tFlow('yes'),
          onClick: () => {
            onDelete?.(comment.id);
            setDeleteOpen(false);
            setDeleteSuccessOpen(true);
          },
        }}
        secondaryAction={{
          label: tFlow('no'),
          onClick: () => setDeleteOpen(false),
        }}
      />

      <AppDialog
        open={deleteSuccessOpen}
        onOpenChange={setDeleteSuccessOpen}
        variant="confirm"
        title={tFlow('deleteSuccess')}
        actionsStyle="text"
        primaryAction={{
          label: tFlow('close'),
          onClick: () => setDeleteSuccessOpen(false),
        }}
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
  reactionsAccess,
  replyAccess,
  transferAccess,
  showFeature,
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
  reactionsAccess: ActionAccess;
  replyAccess: ActionAccess;
  transferAccess: ActionAccess;
  showFeature: boolean;
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
  const showReactions = isActionVisible(reactionsAccess);
  const readonlyReactions = reactionsAccess === 'readonly';
  const hasActions =
    showReactions ||
    isActionVisible(replyAccess) ||
    isActionVisible(transferAccess) ||
    showFeature;

  if (!hasActions) return null;

  // RTL order per Figma: like · dislike · transfer · reply · feature.
  return (
    <div className="flex w-full justify-end">
      <div
        dir="rtl"
        className="flex flex-wrap items-center gap-1 text-neutral-600 dark:text-app-filter-muted"
      >
        {showReactions ? (
          <>
            <ActionButton
              label={labels.like}
              count={likes}
              active={liked}
              activeClassName="text-like"
              disabled={disabled || readonlyReactions}
              onClick={onLike}
              icon={<Heart className="size-5" fill="none" strokeWidth={1.5} />}
            />
            <ActionButton
              label={labels.dislike}
              count={dislikes}
              active={reaction === 'dislike'}
              disabled={disabled || readonlyReactions}
              onClick={onDislike}
              icon={<ThumbsDown className="size-5" strokeWidth={1.5} />}
            />
          </>
        ) : null}
        {isActionVisible(transferAccess) ? (
          <ActionButton
            label={labels.transfer}
            count={shares}
            disabled={transferAccess === 'readonly'}
            onClick={onTransfer}
            icon={<Repeat2 className="size-5" strokeWidth={1.5} />}
          />
        ) : null}
        {isActionVisible(replyAccess) ? (
          <ActionButton
            label={labels.reply}
            disabled={replyAccess === 'readonly'}
            onClick={onReply}
            icon={<Reply className="size-5" strokeWidth={1.5} />}
          />
        ) : null}
        {showFeature ? (
          <ActionButton
            label={featured ? labels.unfeature : labels.feature}
            active={featured}
            activeClassName="text-warning"
            onClick={onToggleFeature}
            icon={
              featured ? (
                <Star className="size-5 text-warning" strokeWidth={1.5} />
              ) : (
                <StarOff className="size-5" strokeWidth={1.5} />
              )
            }
          />
        ) : null}
      </div>
    </div>
  );
}

type CommentMenuItem = { label: string; onSelect: () => void } | null;

/** «⋮» menu — items already filtered by capabilities (delete / restore / note / report). */
function CommentMenu({
  open,
  onOpenChange,
  moreLabel,
  items,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moreLabel: string;
  items: CommentMenuItem[];
}) {
  const visible = items.filter((item): item is NonNullable<CommentMenuItem> =>
    Boolean(item)
  );
  if (visible.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={moreLabel}
          className="shrink-0 text-neutral-600 hover:text-app-filter-ink dark:text-app-filter-muted dark:hover:text-app-filter-ink"
        >
          <MoreVertical className="size-5" strokeWidth={1.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        dir="rtl"
        className="w-[240px] gap-0 rounded-xl border-0 bg-app-search-fill p-1 shadow-app-elevation-2 ring-0 dark:bg-app-search-category"
      >
        <ul className="flex flex-col py-1">
          {visible.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-app-filter-ink hover:bg-black/[0.04] dark:hover:bg-white/10"
                onClick={() => {
                  onOpenChange(false);
                  item.onSelect();
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
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
              'w-full resize-none rounded-xl border border-border bg-app-stat-card px-3 pb-8 pt-3',
              'text-start text-xs font-medium leading-5 text-app-filter-ink',
              'placeholder:text-neutral-600 focus-visible:border-primary focus-visible:outline-none',
              'dark:border-border dark:bg-app-search-category dark:text-app-filter-ink',
              'dark:placeholder:text-app-filter-muted dark:focus-visible:border-primary-100'
            )}
          />
          <span className="pointer-events-none absolute bottom-3 end-3 text-[11px] leading-4 text-neutral-600 dark:text-app-filter-muted">
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
