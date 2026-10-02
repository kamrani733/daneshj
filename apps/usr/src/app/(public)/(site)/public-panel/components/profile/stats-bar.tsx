'use client';

import {
  Heart,
  HeartCrack,
  HeartPlus,
  Share2,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { PublicPanelCapabilities } from '@public-panel/capabilities';
import { useProfileStatsBar } from '@public-panel/hooks/use-profile-stats-bar';
import type { PublicPanelProfile } from '@public-panel/types/ui';
import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import {
  StatsPeopleDialog,
  StatsShareDialog,
} from '@public-panel/components/profile/stats-dialogs';
import { useGuardedAction } from '@public-panel/components/shared/guest-access-dialog';

type ProfileStatsBarProps = {
  profile: PublicPanelProfile;
  accessToken?: string | null;
  viewerActorId?: number | null;
  capabilities: PublicPanelCapabilities;
};

function HeartCheckIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn('relative inline-flex size-5 shrink-0', className)}
      aria-hidden
    >
      <Heart className="size-full" strokeWidth={1.75} />
      <svg
        viewBox="0 0 8 8"
        className="absolute -bottom-px -end-px size-[40%] min-w-2"
      >
        <circle cx="4" cy="4" r="4" className="fill-app-scene dark:fill-app-search-category" />
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

type StatKey = keyof PublicPanelProfile['stats'] | 'dislikers';

const STAT_ITEMS: {
  key: StatKey;
  Icon: LucideIcon | 'heartCheck';
  adminOnly?: boolean;
}[] = [
  { key: 'followers', Icon: UserPlus },
  { key: 'following', Icon: UserCheck },
  { key: 'likers', Icon: HeartPlus },
  { key: 'liked', Icon: 'heartCheck' },
  // UsrPb_DspIntr: dislike count and list only for admin.
  { key: 'dislikers', Icon: HeartCrack, adminOnly: true },
];

/** Stats, reactions, and follow action row. */
export function ProfileStatsBar({
  profile,
  accessToken,
  viewerActorId,
  capabilities,
}: ProfileStatsBarProps) {
  const t = useTranslations('publicPanel');
  const vm = useProfileStatsBar({
    profile,
    accessToken,
    viewerActorId,
    capabilities,
  });
  const guard = useGuardedAction();
  const access = vm.engagementAccess;
  const statItems = STAT_ITEMS.filter(
    (item) => !item.adminOnly || capabilities.showDislikes
  );

  return (
    <div
      className={cn(
        'flex w-full flex-col items-stretch gap-5 rounded-[24px] border-2 border-primary-subtle bg-app-scene px-4 py-5',
        'dark:border-border dark:bg-app-search-category',
        'min-[834px]:gap-6 min-[834px]:px-6 min-[834px]:py-6',
        'min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:gap-8 min-[1100px]:px-[38px]'
      )}
    >
      <ul
        className={cn(
          'flex w-full items-start justify-between gap-1 min-[834px]:justify-center min-[834px]:gap-6 min-[1100px]:gap-8',
          // Counts only (owner / guest): centered across the bar.
          vm.showActions
            ? 'min-[1100px]:w-auto min-[1100px]:justify-start'
            : 'min-[1100px]:justify-center min-[1100px]:gap-24'
        )}
      >
        {statItems.map(({ key, Icon }) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => vm.setPeopleKind(key)}
              className="flex min-w-0 flex-col items-center gap-1 rounded-xl text-center transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] min-[834px]:w-[88px]"
            >
              <span className="text-2xl font-bold leading-8 text-app-filter-ink min-[834px]:text-[28px] min-[834px]:leading-9 min-[1100px]:text-[34px] min-[1100px]:leading-[49px]">
                {formatFaNumber(vm.displayStats[key])}
              </span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold leading-4 text-app-filter-muted dark:text-app-filter-ink min-[834px]:gap-1.5 min-[834px]:text-sm min-[834px]:leading-5 min-[1100px]:gap-2 min-[1100px]:text-[17px] min-[1100px]:leading-6">
                {Icon === 'heartCheck' ? (
                  <HeartCheckIcon className="hidden size-3.5 min-[720px]:inline-flex min-[834px]:size-5" />
                ) : (
                  <Icon
                    className="hidden size-3.5 shrink-0 min-[720px]:block min-[834px]:size-4 min-[1100px]:size-5"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                )}
                {t(`stats.${key}`)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {vm.showActions ? (
        <div
          className={cn(
            /* mobile: reactions then follow, stacked & centered */
            'flex w-full flex-col items-center gap-4',
            /* tablet: one row, follow on visual left / reactions on right */
            'min-[834px]:flex-row min-[834px]:items-center min-[834px]:justify-between min-[834px]:gap-6',
            /* desktop: sit beside stats */
            'min-[1100px]:w-auto min-[1100px]:shrink-0 min-[1100px]:justify-end min-[1100px]:gap-12'
          )}
        >
          <ul className="flex items-center justify-center gap-5 text-app-filter-muted dark:text-app-filter-ink min-[834px]:gap-6 min-[1100px]:gap-8">
            <li>
              <button
                type="button"
                disabled={vm.likeMutation.isPending}
                onClick={() =>
                  guard(access, () => void vm.handleReaction('like'))
                }
                className={cn(
                  'flex h-11 items-center gap-1 px-1 text-sm font-bold leading-6 text-app-filter-muted dark:text-app-filter-ink disabled:opacity-100',
                  'min-[834px]:h-12 min-[834px]:text-base min-[1100px]:h-14',
                  vm.reaction === 'like' &&
                    'text-primary dark:text-primary-100'
                )}
                aria-pressed={vm.reaction === 'like'}
              >
                <ThumbsUp
                  className="size-6 shrink-0 min-[834px]:size-7 min-[1100px]:size-8"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span>{formatFaNumber(vm.stats.thumbsUp)}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                disabled={vm.likeMutation.isPending}
                onClick={() =>
                  guard(access, () => void vm.handleReaction('dislike'))
                }
                aria-pressed={vm.reaction === 'dislike'}
                className={cn(
                  'flex h-11 items-center gap-1 px-1 text-sm font-bold leading-6 text-app-filter-muted dark:text-app-filter-ink disabled:opacity-100',
                  'min-[834px]:h-12 min-[834px]:text-base min-[1100px]:h-14',
                  vm.reaction === 'dislike' && 'text-warning'
                )}
              >
                <ThumbsDown
                  className="size-6 shrink-0 min-[834px]:size-7 min-[1100px]:size-8"
                  strokeWidth={1.5}
                  aria-hidden
                />
                {/* Dislike count is admin-only (UsrPb_DspIntr); visitors see their own pressed state. */}
              </button>
            </li>
            <li>
              <button
                type="button"
                disabled={vm.shareMutation.isPending}
                onClick={() => guard(access, () => vm.setShareOpen(true))}
                className={cn(
                  'flex h-11 items-center gap-1 px-1 text-sm font-bold leading-6 text-app-filter-muted dark:text-app-filter-ink disabled:opacity-100',
                  'min-[834px]:h-12 min-[834px]:text-base min-[1100px]:h-14'
                )}
              >
                <Share2
                  className="size-6 shrink-0 min-[834px]:size-7 min-[1100px]:size-8"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span>{formatFaNumber(vm.shares)}</span>
              </button>
            </li>
          </ul>

          <Button
            type="button"
            size="pillSm"
            variant={vm.following ? 'outline' : 'default'}
            disabled={vm.followMutation.isPending}
            onClick={() => guard(access, () => void vm.handleFollow())}
            className={cn(
              'h-auto min-w-[128px] shrink-0 rounded-full px-8 py-3.5 text-base font-medium leading-6',
              'min-[834px]:w-auto min-[834px]:min-w-[140px] min-[834px]:py-4',
              'min-[1100px]:min-w-[153px] disabled:opacity-100',
              vm.following
                ? 'border-primary text-primary dark:border-primary-100 dark:text-primary-100'
                : 'bg-primary text-primary-foreground hover:bg-primary-hover disabled:bg-primary dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-100/90 dark:disabled:bg-primary-100'
            )}
          >
            {vm.following ? t('following') : t('follow')}
          </Button>
        </div>
      ) : null}

      <StatsPeopleDialog
        kind={vm.peopleKind}
        open={vm.peopleKind != null}
        people={vm.peopleKind ? vm.people[vm.peopleKind] : []}
        loading={vm.isLoading && vm.peopleKind != null}
        actions={capabilities.peopleListActions}
        username={profile.username}
        onGuestAction={() => guard('guestMessage', () => undefined)}
        onPersonAction={(person, nextFollowing) => {
          void vm.handlePeopleAction(person, nextFollowing);
        }}
        onOpenChange={(next) => {
          if (!next) vm.setPeopleKind(null);
        }}
      />

      <StatsShareDialog
        open={vm.shareOpen}
        onOpenChange={vm.setShareOpen}
        shareUrl={vm.shareUrl}
        onShared={(reason) => {
          void vm.handleShareConfirm(reason);
        }}
      />
    </div>
  );
}
