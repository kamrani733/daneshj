'use client';

import {
  Heart,
  HeartPlus,
  Share2,
  ThumbsDown,
  ThumbsUp,
  User,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { PublicPanelProfile } from '@public-panel/data/public-panel-mock';
import { Button } from '@/components/ui/button';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

type ProfileStatsBarProps = {
  stats: PublicPanelProfile['stats'];
  engagement: PublicPanelProfile['engagement'];
};

const STAT_ITEMS: {
  key: keyof PublicPanelProfile['stats'];
  Icon: LucideIcon;
}[] = [
  { key: 'followers', Icon: UserPlus },
  { key: 'following', Icon: User },
  { key: 'likers', Icon: HeartPlus },
  { key: 'liked', Icon: Heart },
];

/**
 * Figma stats strip: metric columns with icons · reactions · follow CTA.
 */
export function ProfileStatsBar({ stats, engagement }: ProfileStatsBarProps) {
  const t = useTranslations('publicPanel');
  const [following, setFollowing] = useState(false);

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 rounded-2xl bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
        'dark:bg-home-search-category',
        'min-[960px]:flex-row min-[960px]:items-center min-[960px]:justify-between min-[960px]:gap-6 min-[960px]:px-6'
      )}
    >
      {/* RTL: stats on the right */}
      <ul className="flex flex-wrap items-stretch justify-end gap-1">
        {STAT_ITEMS.map(({ key, Icon }) => (
          <li
            key={key}
            className="flex min-w-[6.5rem] flex-col items-center justify-center gap-1 px-3 py-1 text-center"
          >
            <span className="text-lg font-bold leading-7 text-content">
              {formatFaNumber(stats[key])}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium leading-4 text-home-filter-muted">
              <Icon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
              {t(`stats.${key}`)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 min-[960px]:justify-start min-[960px]:gap-6">
        <ul className="flex items-center gap-5 text-home-filter-ink">
          <li dir="ltr" className="flex items-center gap-1.5 text-sm font-bold">
            <ThumbsUp className="size-5" strokeWidth={1.5} aria-hidden />
            <span>{formatFaNumber(engagement.thumbsUp)}</span>
          </li>
          <li dir="ltr" className="flex items-center gap-1.5 text-sm font-bold">
            <ThumbsDown className="size-5" strokeWidth={1.5} aria-hidden />
            <span>{formatFaNumber(engagement.thumbsDown)}</span>
          </li>
          <li dir="ltr" className="flex items-center gap-1.5 text-sm font-bold">
            <Share2 className="size-5" strokeWidth={1.5} aria-hidden />
            <span>{formatFaNumber(engagement.shares)}</span>
          </li>
        </ul>

        <Button
          type="button"
          size="pillSm"
          variant={following ? 'outline' : 'default'}
          onClick={() => setFollowing((v) => !v)}
          className="h-10 min-w-[128px] rounded-full px-7"
        >
          {following ? t('following') : t('follow')}
        </Button>
      </div>
    </div>
  );
}
