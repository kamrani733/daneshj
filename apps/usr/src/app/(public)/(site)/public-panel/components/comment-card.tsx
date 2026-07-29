'use client';

import {
  ChevronDown,
  Flag,
  Heart,
  MessageCircle,
  Share2,
  Star,
  ThumbsDown,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';

import type { PanelComment } from '@public-panel/data/public-panel-mock';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type CommentCardProps = {
  comment: PanelComment;
  className?: string;
  nested?: boolean;
};

/** Figma comment thread item — avatar, body box, actions, nested replies. */
export function CommentCard({
  comment,
  className,
  nested = false,
}: CommentCardProps) {
  const t = useTranslations('publicPanel.comments');
  const replies = comment.replies ?? [];
  const [showReplies, setShowReplies] = useState(replies.length > 0 && !nested);
  const isTransferred = comment.kind === 'transferred';
  const featured = Boolean(comment.featured);

  return (
    <article
      className={cn(
        'relative flex flex-col gap-3 rounded-xl p-4',
        featured
          ? 'bg-warning-10 ring-1 ring-warning/30'
          : 'bg-white dark:bg-home-search-category',
        !nested &&
          (isTransferred
            ? 'border-s-4 border-s-primary'
            : featured
              ? 'border-s-4 border-s-warning'
              : 'border-s-4 border-s-[#D1D5DB] dark:border-s-border'),
        nested && 'bg-primary-subtle/60 ring-1 ring-primary/25 dark:bg-primary/10',
        className
      )}
    >
      <header className="flex items-start gap-3">
        <Avatar className="size-10 shrink-0 ring-1 ring-[#F3D0C4]">
          {comment.authorAvatar ? (
            <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
          ) : null}
          <AvatarFallback>{comment.authorName.slice(0, 1)}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-content">{comment.authorName}</h4>
            <span className="text-xs text-home-filter-muted">
              @{comment.authorHandle}
            </span>
            <span className="text-xs text-home-filter-muted">
              · {comment.createdAt}
            </span>
            {isTransferred && !nested ? (
              <span className="rounded-full bg-primary-subtle px-2 py-0.5 text-[11px] font-medium text-primary">
                {t('badgeTransferred')}
              </span>
            ) : null}
            {featured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-[11px] font-medium text-warning">
                <Star className="size-3 fill-warning text-warning" />
                {t('badgeFeatured')}
              </span>
            ) : null}
          </div>
          {comment.replyToName ? (
            <p className="text-xs text-home-filter-muted">
              {t('inReplyTo', { name: comment.replyToName })}
            </p>
          ) : null}
        </div>
      </header>

      <div
        className={cn(
          'rounded-lg px-3 py-2.5 text-sm leading-6 text-content',
          nested || isTransferred
            ? 'border border-primary/30 bg-primary-subtle/80 dark:bg-primary/15'
            : 'border border-border/60 bg-home-search-fill dark:bg-home-card/40'
        )}
      >
        {comment.body}
      </div>

      <div className="flex flex-wrap items-center gap-1 text-home-filter-muted">
        <ActionButton
          label={t('like')}
          count={comment.likes}
          icon={<Heart className="size-4" strokeWidth={1.5} />}
        />
        <ActionButton
          label={t('dislike')}
          count={comment.dislikes}
          icon={<ThumbsDown className="size-4" strokeWidth={1.5} />}
        />
        <ActionButton
          label={t('share')}
          count={comment.shares}
          icon={<Share2 className="size-4" strokeWidth={1.5} />}
        />
        <ActionButton
          label={t('reply')}
          icon={<MessageCircle className="size-4" strokeWidth={1.5} />}
        />
        <ActionButton
          label={t('report')}
          icon={<Flag className="size-4" strokeWidth={1.5} />}
        />
        {featured ? (
          <span className="ms-auto inline-flex items-center text-warning">
            <Star className="size-4 fill-warning" aria-hidden />
          </span>
        ) : null}
      </div>

      {!nested && replies.length > 0 ? (
        <div className="flex flex-col gap-3 border-s border-primary/30 ps-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies((v) => !v)}
            className="h-8 w-fit gap-1 px-2 text-sm font-medium text-primary"
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
          </Button>
          {showReplies
            ? replies.map((reply) => (
                <CommentCard key={reply.id} comment={reply} nested />
              ))
            : null}
        </div>
      ) : null}
    </article>
  );
}

function ActionButton({
  label,
  count,
  icon,
}: {
  label: string;
  count?: number;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-xs hover:bg-black/5 dark:hover:bg-white/10"
    >
      {icon}
      {count != null && count > 0 ? (
        <span>{formatFaNumber(count)}</span>
      ) : null}
    </button>
  );
}
