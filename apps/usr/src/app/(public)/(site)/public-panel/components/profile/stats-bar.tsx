'use client';

import {
  Heart,
  HeartPlus,
  Share2,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  ACTOR_TYPE,
  LIKE_STATUS,
  SHARE_PLATFORM,
  TARGET_TYPE,
  useFollowMutation,
  useLikeMutation,
  usePanelInteractiveStatsQuery,
  useShareMutation,
} from '@public-panel/api';
import type { PublicPanelProfile } from '@public-panel/data/public-panel-ui';
import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type ProfileStatsBarProps = {
  profile: PublicPanelProfile;
  accessToken?: string | null;
  viewerActorId?: number | null;
};

/** Heart with check — Figma «پسند شونده». */
function HeartCheckIcon({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-flex size-3.5', className)} aria-hidden>
      <Heart className="size-3.5" strokeWidth={1.75} />
      <svg
        viewBox="0 0 8 8"
        className="absolute -bottom-px -end-px size-2.5"
      >
        <circle cx="4" cy="4" r="4" fill="#FAFBF6" />
        <path
          d="M2.1 4.1 3.3 5.3 5.9 2.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const STAT_ITEMS: {
  key: keyof PublicPanelProfile['stats'];
  Icon: LucideIcon | 'heartCheck';
}[] = [
  { key: 'followers', Icon: UserPlus },
  { key: 'following', Icon: UserCheck },
  { key: 'likers', Icon: HeartPlus },
  { key: 'liked', Icon: 'heartCheck' },
];

/**
 * Figma Interaction box — metrics · reactions · follow CTA.
 * Wired to Interactive Ops MS (follow / like / share + list counts).
 */
export function ProfileStatsBar({
  profile,
  accessToken,
  viewerActorId,
}: ProfileStatsBarProps) {
  const t = useTranslations('publicPanel');
  const [following, setFollowing] = useState(false);
  const [reaction, setReaction] = useState<'like' | 'dislike' | 'none'>('none');
  const [shares, setShares] = useState(profile.engagement.shares);

  const { stats } = usePanelInteractiveStatsQuery(
    {
      accessToken,
      targetId: profile.actorId,
      targetType: profile.actorType,
      actorType: profile.actorType,
    },
    true,
    {
      followers: profile.stats.followers,
      following: profile.stats.following,
      likers: profile.stats.likers,
      liked: profile.stats.liked,
      thumbsUp: profile.engagement.thumbsUp,
      thumbsDown: profile.engagement.thumbsDown,
    }
  );

  const followMutation = useFollowMutation();
  const likeMutation = useLikeMutation();
  const shareMutation = useShareMutation();

  const canInteract =
    !!accessToken &&
    viewerActorId != null &&
    viewerActorId > 0 &&
    viewerActorId !== profile.actorId;

  const displayStats = {
    followers: stats.followers,
    following: stats.following,
    likers: stats.likers,
    liked: stats.liked,
  };

  async function handleFollow() {
    if (!canInteract || !viewerActorId) return;
    const next = !following;
    setFollowing(next);
    try {
      const result = await followMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE.user,
        actorId: viewerActorId,
        targetType: profile.actorType,
        targetId: profile.actorId,
        isActive: next,
      });
      setFollowing(result.isActive);
    } catch {
      setFollowing(!next);
    }
  }

  async function handleReaction(next: 'like' | 'dislike') {
    if (!canInteract || !viewerActorId) return;
    const likeStatus =
      reaction === next
        ? LIKE_STATUS.none
        : next === 'like'
          ? LIKE_STATUS.like
          : LIKE_STATUS.dislike;
    const previous = reaction;
    setReaction(
      likeStatus === LIKE_STATUS.none
        ? 'none'
        : likeStatus === LIKE_STATUS.like
          ? 'like'
          : 'dislike'
    );
    try {
      const result = await likeMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE.user,
        actorId: viewerActorId,
        targetType: profile.actorType,
        targetId: profile.actorId,
        likeStatus,
      });
      setReaction(
        result.status === LIKE_STATUS.like
          ? 'like'
          : result.status === LIKE_STATUS.dislike
            ? 'dislike'
            : 'none'
      );
    } catch {
      setReaction(previous);
    }
  }

  async function handleShare() {
    if (!canInteract || !viewerActorId) return;
    try {
      await shareMutation.mutateAsync({
        accessToken,
        actorType: ACTOR_TYPE.user,
        actorId: viewerActorId,
        targetType: profile.actorType as typeof TARGET_TYPE.user,
        targetId: profile.actorId,
        platform: SHARE_PLATFORM.inSite,
        url:
          typeof window !== 'undefined' ? window.location.href : '/public-panel',
      });
      setShares((value) => value + 1);
    } catch {
      /* keep prior count */
    }
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 rounded-[20px] border border-[#C6D9CF] bg-[#FAFBF6] px-4 py-3.5',
        'dark:border-border dark:bg-home-search-category',
        'min-[960px]:h-[72px] min-[960px]:flex-row min-[960px]:items-center min-[960px]:justify-between min-[960px]:gap-4 min-[960px]:px-5 min-[960px]:py-0'
      )}
    >
      <ul className="flex flex-wrap items-center justify-end gap-1 min-[960px]:gap-0">
        {STAT_ITEMS.map(({ key, Icon }) => (
          <li
            key={key}
            className="flex w-[88px] flex-col items-center justify-center gap-0.5 px-1 text-center min-[960px]:w-[100px]"
          >
            <span className="text-[22px] font-bold leading-7 tracking-[0.0094em] text-[#171D19] dark:text-content">
              {formatFaNumber(displayStats[key])}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium leading-4 text-[#171D19] dark:text-content">
              {Icon === 'heartCheck' ? (
                <HeartCheckIcon />
              ) : (
                <Icon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
              )}
              {t(`stats.${key}`)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 min-[960px]:justify-start min-[960px]:gap-6">
        <ul className="flex items-center gap-5 text-[#171D19] dark:text-content">
          <li>
            <button
              type="button"
              disabled={!canInteract || likeMutation.isPending}
              onClick={() => void handleReaction('like')}
              className={cn(
                'flex items-center gap-1.5 text-sm font-bold leading-5 disabled:opacity-50',
                reaction === 'like' && 'text-primary'
              )}
              aria-pressed={reaction === 'like'}
            >
              <ThumbsUp className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
              <span>{formatFaNumber(stats.thumbsUp)}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              disabled={!canInteract || likeMutation.isPending}
              onClick={() => void handleReaction('dislike')}
              className={cn(
                'flex items-center gap-1.5 text-sm font-bold leading-5 disabled:opacity-50',
                reaction === 'dislike' && 'text-warning'
              )}
            >
              <ThumbsDown className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
              <span>{formatFaNumber(stats.thumbsDown)}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              disabled={!canInteract || shareMutation.isPending}
              onClick={() => void handleShare()}
              className="flex items-center gap-1.5 text-sm font-bold leading-5 disabled:opacity-50"
            >
              <Share2 className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
              <span>{formatFaNumber(shares)}</span>
            </button>
          </li>
        </ul>

        <Button
          type="button"
          size="pillSm"
          variant={following ? 'outline' : 'default'}
          disabled={!canInteract || followMutation.isPending}
          onClick={() => void handleFollow()}
          className={cn(
            'h-10 min-w-[120px] rounded-full px-6 text-sm font-medium',
            !following && 'bg-primary hover:bg-primary-hover'
          )}
        >
          {following ? t('following') : t('follow')}
        </Button>
      </div>
    </div>
  );
}
