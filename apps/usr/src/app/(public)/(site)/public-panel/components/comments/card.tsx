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
import { useState, type ReactNode } from 'react';

import {
  ACTOR_TYPE,
  LIKE_STATUS,
  SHARE_PLATFORM,
  TARGET_TYPE,
  useLikeMutation,
  useShareMutation,
} from '@public-panel/api';
import type { PanelComment } from '@public-panel/data/public-panel-ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { CommentTransferFlow, CommentConfirmDialog } from './transfer-flow';

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
}: CommentCardProps) {
  const t = useTranslations('publicPanel.comments');
  const tFlow = useTranslations('publicPanel.comments.transferFlow');
  const replies = comment.replies ?? [];
  const [showReplies, setShowReplies] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);
  const [shares, setShares] = useState(comment.shares);
  const [reaction, setReaction] = useState<'like' | 'dislike' | 'none'>('none');
  const [featured, setFeatured] = useState(Boolean(comment.featured));
  const [transferOpen, setTransferOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const isTransferred = comment.kind === 'transferred';

  const likeMutation = useLikeMutation();
  const shareMutation = useShareMutation();

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

  async function handleShare() {
    if (!canInteract || !viewerActorId) return;
    try {
      await shareMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE.user,
        actorId: viewerActorId,
        targetType: TARGET_TYPE.comment,
        targetId,
        platform: SHARE_PLATFORM.inSite,
        url:
          typeof window !== 'undefined' ? window.location.href : '/public-panel',
      });
      setShares((value) => value + 1);
    } catch {
      /* keep prior count */
    }
  }

  const interaction = (
    <InteractionRow
      likes={likes}
      dislikes={dislikes}
      shares={shares}
      reaction={reaction}
      featured={featured}
      disabled={likeMutation.isPending}
      shareDisabled={!canInteract || shareMutation.isPending}
      onLike={() => void handleReaction('like')}
      onDislike={() => void handleReaction('dislike')}
      onShare={() => void handleShare()}
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
          'relative flex flex-col items-stretch gap-3 rounded-xl bg-white p-4 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]',
          className
        )}
      >
        <div className="absolute end-3 top-3">
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={t('more')}
                className="text-[#707973] hover:text-[#171D19]"
              >
                <MoreVertical className="size-5" strokeWidth={1.5} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={6}
              dir="rtl"
              className="w-[240px] gap-0 rounded-xl border-0 bg-[#F8F8F0] p-1 shadow-home-elevation-2 ring-0"
            >
              <ul className="flex flex-col py-1">
                <li>
                  <button
                    type="button"
                    className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-[#171D19] hover:bg-black/[0.04]"
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
                    className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-[#171D19] hover:bg-black/[0.04]"
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
                    className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-[#171D19] hover:bg-black/[0.04]"
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
          <Avatar className="size-12 shrink-0 ring-2 ring-[#008D63]">
            {comment.authorAvatar ? (
              <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
            ) : null}
            <AvatarFallback className="bg-white text-base font-bold text-[#171D19]">
              {comment.authorName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col items-start gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-[#171D19]">
                {comment.authorName}
              </h4>
              <span className="text-xs text-[#707973]">
                @{comment.authorHandle}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#707973]">
              {comment.timeLabel ? <span>{comment.timeLabel}</span> : null}
              <span>{comment.createdAt}</span>
              <span aria-hidden>•</span>
              {comment.statusLabel ? <span>{comment.statusLabel}</span> : null}
            </div>
          </div>
        </header>

        {comment.quoteNote ? (
          <p className="w-full text-start text-sm leading-normal text-[#171D19]">
            &quot;{comment.quoteNote}&quot;
          </p>
        ) : null}

        <div className="w-full rounded-xl border border-[#008D63] bg-[rgba(0,141,99,0.1)] p-4">
          <div className="flex flex-col items-stretch gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#707973] text-[12.8px] font-bold text-white">
                {(comment.originalAuthorName ?? comment.authorName).slice(0, 2)}
              </div>
              <span className="text-sm font-bold text-[#171D19]">
                {comment.originalAuthorName ?? comment.authorName} @
                {comment.originalAuthorHandle ?? comment.authorHandle}
              </span>
            </div>
            <p className="w-full text-start text-sm leading-[1.5] text-[#171D19]">
              {comment.body}
            </p>
          </div>
        </div>

        {interaction}
      </article>
    );
  }

  return (
    <article
      className={cn(
        'relative rounded-xl p-4 shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]',
        featured
          ? 'border-s-[3px] border-s-[#F59E0B] bg-[#FFF5EB]'
          : 'bg-white',
        nested && 'bg-[#F8F8F0]',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-12 shrink-0 bg-[#BFC9C1]">
          {comment.authorAvatar ? (
            <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
          ) : null}
          <AvatarFallback className="bg-[#BFC9C1] text-base font-bold text-white">
            {comment.authorName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <header className="flex w-full items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-[#171D19]">
                {comment.authorName}
              </h4>
              <span className="text-xs font-medium text-[#707973]">
                @{comment.authorHandle}
              </span>
              <span className="text-xs font-medium text-[#707973]">
                {comment.createdAt}
              </span>
              <span className="text-[#707973]" aria-hidden>
                •
              </span>
              {comment.timeLabel ? (
                <span className="text-xs font-medium text-[#707973]">
                  {comment.timeLabel}
                </span>
              ) : null}
              {featured ? (
                <Badge className="h-auto gap-1 border-0 bg-transparent px-0 text-xs font-bold text-[#F59E0B]">
                  <Star className="size-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  {t('badgeFeatured')}
                </Badge>
              ) : null}
            </div>
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={t('more')}
                  className="shrink-0 text-[#707973] hover:text-[#171D19]"
                >
                  <MoreVertical className="size-5" strokeWidth={1.5} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={6}
                dir="rtl"
                className="w-[240px] gap-0 rounded-xl border-0 bg-[#F8F8F0] p-1 shadow-home-elevation-2 ring-0"
              >
                <ul className="flex flex-col py-1">
                  <li>
                    <button
                      type="button"
                      className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-[#171D19] hover:bg-black/[0.04]"
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
                      className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-[#171D19] hover:bg-black/[0.04]"
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
                      className="flex h-11 w-full items-center px-3 text-start text-sm font-medium text-[#171D19] hover:bg-black/[0.04]"
                      onClick={() => setMenuOpen(false)}
                    >
                      {tFlow('menuReport')}
                    </button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </header>

          <p className="w-full text-start text-sm font-medium leading-5 text-[#171D19]">
            {comment.body}
          </p>

          <div className="h-px w-full bg-[#F1EFE9]" aria-hidden />

          {interaction}

          {!nested && replies.length > 0 ? (
            <div className="flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={() => setShowReplies((v) => !v)}
                className="inline-flex h-9 w-fit items-center gap-1 rounded-full border border-[#BFC9C1] px-3 text-sm font-medium text-[#404943]"
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
              {showReplies
                ? replies.map((reply) => (
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
                    />
                  ))
                : null}
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
  shareDisabled,
  onLike,
  onDislike,
  onShare,
  onToggleFeature,
  labels,
}: {
  likes: number;
  dislikes: number;
  shares: number;
  reaction: 'like' | 'dislike' | 'none';
  featured: boolean;
  disabled?: boolean;
  shareDisabled?: boolean;
  onLike: () => void;
  onDislike: () => void;
  onShare: () => void;
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
        className="flex flex-wrap items-center gap-1 text-[#707973]"
      >
        <ActionButton
          label={labels.like}
          count={likes}
          active={liked}
          activeClassName="text-[#F66060]"
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
          disabled={shareDisabled}
          onClick={onShare}
          icon={<Repeat2 className="size-5" strokeWidth={1.5} />}
        />
        <ActionButton
          label={labels.reply}
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

function ActionButton({
  label,
  count,
  icon,
  active,
  className,
  activeClassName = 'text-primary',
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
        'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm hover:bg-black/5 disabled:opacity-50',
        className,
        active && activeClassName
      )}
    >
      {icon}
      {count != null ? <span>{formatFaNumber(count)}</span> : null}
    </button>
  );
}
