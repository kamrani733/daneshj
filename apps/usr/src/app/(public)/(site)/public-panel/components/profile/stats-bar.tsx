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

function HeartCheckIcon({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-flex size-5', className)} aria-hidden>
      <Heart className="size-5" strokeWidth={1.75} />
      <svg
        viewBox="0 0 8 8"
        className="absolute -bottom-px -end-px size-2.5"
      >
        <circle cx="4" cy="4" r="4" fill="#FAFAF7" />
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

/** Stats, reactions, and follow action row. */
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
    const next = !following;
    setFollowing(next);
    if (!canInteract || !viewerActorId || !accessToken) return;
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
    if (!canInteract || !viewerActorId || !accessToken) return;
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
    setShares((value) => value + 1);
    if (!canInteract || !viewerActorId || !accessToken) return;
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
    } catch {
      setShares((value) => Math.max(0, value - 1));
    }
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col items-stretch gap-5 rounded-[24px] border-2 border-[#D3F4E1] bg-[#FAFAF7] px-5 py-5',
        'dark:border-border dark:bg-home-search-category',
        'min-[1100px]:h-auto min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:gap-6 min-[1100px]:px-[38px] min-[1100px]:py-6'
      )}
    >
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 min-[1100px]:flex-nowrap min-[1100px]:gap-x-5">
        {STAT_ITEMS.map(({ key, Icon }, index) => (
          <li key={key} className="flex items-center gap-3 min-[1100px]:gap-5">
            <div className="flex w-[72px] flex-col items-center gap-1 text-center min-[1100px]:w-[88px]">
              <span className="text-[26px] font-bold leading-9 text-[#171D19] dark:text-content min-[1100px]:text-[34px] min-[1100px]:leading-[49px]">
                {formatFaNumber(displayStats[key])}
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold leading-5 text-[#404943] dark:text-content min-[1100px]:gap-2 min-[1100px]:text-[17px] min-[1100px]:leading-6">
                {Icon === 'heartCheck' ? (
                  <HeartCheckIcon />
                ) : (
                  <Icon
                    className="size-4 shrink-0 min-[1100px]:size-5"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                )}
                {t(`stats.${key}`)}
              </span>
            </div>
            {index < STAT_ITEMS.length - 1 ? (
              <span
                aria-hidden
                className="hidden h-[74px] w-px shrink-0 bg-[#404943]/15 min-[1100px]:block"
              />
            ) : null}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-center gap-6 min-[1100px]:flex-nowrap min-[1100px]:gap-12">
        <ul className="flex items-center gap-6 text-[#404943] dark:text-content min-[1100px]:gap-8">
          <li>
            <button
              type="button"
              disabled={likeMutation.isPending}
              onClick={() => void handleReaction('like')}
              className={cn(
                'flex h-12 items-center gap-1 px-1 text-base font-bold leading-6 text-[#404943] disabled:opacity-100 min-[1100px]:h-14',
                reaction === 'like' && 'text-primary'
              )}
              aria-pressed={reaction === 'like'}
            >
              <ThumbsUp
                className="size-7 shrink-0 min-[1100px]:size-8"
                strokeWidth={1.5}
                aria-hidden
              />
              <span>{formatFaNumber(stats.thumbsUp)}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              disabled={likeMutation.isPending}
              onClick={() => void handleReaction('dislike')}
              className={cn(
                'flex h-12 items-center gap-1 px-1 text-base font-bold leading-6 text-[#404943] disabled:opacity-100 min-[1100px]:h-14',
                reaction === 'dislike' && 'text-warning'
              )}
            >
              <ThumbsDown
                className="size-7 shrink-0 min-[1100px]:size-8"
                strokeWidth={1.5}
                aria-hidden
              />
              <span>{formatFaNumber(stats.thumbsDown)}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              disabled={shareMutation.isPending}
              onClick={() => void handleShare()}
              className="flex h-12 items-center gap-1 px-1 text-base font-bold leading-6 text-[#404943] disabled:opacity-100 min-[1100px]:h-14"
            >
              <Share2
                className="size-7 shrink-0 min-[1100px]:size-8"
                strokeWidth={1.5}
                aria-hidden
              />
              <span>{formatFaNumber(shares)}</span>
            </button>
          </li>
        </ul>

        <Button
          type="button"
          size="pillSm"
          variant={following ? 'outline' : 'default'}
          disabled={followMutation.isPending}
          onClick={() => void handleFollow()}
          className={cn(
            'h-auto shrink-0 rounded-full px-6 py-4 text-base font-medium leading-6',
            'min-w-[140px] min-[1100px]:min-w-[153px] disabled:opacity-100',
            following
              ? 'border-[#008D63] text-[#008D63]'
              : 'bg-[#008D63] text-white hover:bg-[#007A56] disabled:bg-[#008D63]'
          )}
        >
          {following ? t('following') : t('follow')}
        </Button>
      </div>
    </div>
  );
}
