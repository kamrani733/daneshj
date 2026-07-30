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

import type { PublicPanelProfile } from '@public-panel/data/public-panel-ui';
import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type ProfileStatsBarProps = {
  stats: PublicPanelProfile['stats'];
  engagement: PublicPanelProfile['engagement'];
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
 */
export function ProfileStatsBar({ stats, engagement }: ProfileStatsBarProps) {
  const t = useTranslations('publicPanel');
  const [following, setFollowing] = useState(false);

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 rounded-[20px] border border-[#C6D9CF] bg-[#FAFBF6] px-4 py-3.5',
        'dark:border-border dark:bg-home-search-category',
        'min-[960px]:h-[72px] min-[960px]:flex-row min-[960px]:items-center min-[960px]:justify-between min-[960px]:gap-4 min-[960px]:px-5 min-[960px]:py-0'
      )}
    >
      {/* RTL start = right: four metric columns */}
      <ul className="flex flex-wrap items-center justify-end gap-1 min-[960px]:gap-0">
        {STAT_ITEMS.map(({ key, Icon }) => (
          <li
            key={key}
            className="flex w-[88px] flex-col items-center justify-center gap-0.5 px-1 text-center min-[960px]:w-[100px]"
          >
            <span className="text-[22px] font-bold leading-7 tracking-[0.0094em] text-[#171D19] dark:text-content">
              {formatFaNumber(stats[key])}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium leading-4 text-[#171D19] dark:text-content">
              {/* Icon to the right of label in RTL → first in DOM */}
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
        {/* Figma: number then icon (icon on the visual right of the pair → use RTL row) */}
        <ul className="flex items-center gap-5 text-[#171D19] dark:text-content">
          <li className="flex items-center gap-1.5 text-sm font-bold leading-5">
            <ThumbsUp className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
            <span>{formatFaNumber(engagement.thumbsUp)}</span>
          </li>
          <li className="flex items-center gap-1.5 text-sm font-bold leading-5">
            <ThumbsDown className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
            <span>{formatFaNumber(engagement.thumbsDown)}</span>
          </li>
          <li className="flex items-center gap-1.5 text-sm font-bold leading-5">
            <Share2 className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
            <span>{formatFaNumber(engagement.shares)}</span>
          </li>
        </ul>

        <Button
          type="button"
          size="pillSm"
          variant={following ? 'outline' : 'default'}
          onClick={() => setFollowing((v) => !v)}
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
