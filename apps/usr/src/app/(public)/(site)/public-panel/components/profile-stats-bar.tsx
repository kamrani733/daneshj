'use client';

import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
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

const STAT_KEYS = [
  'followers',
  'following',
  'likers',
  'liked',
] as const;

/**
 * Figma stats strip: counts with dividers · reactions · follow CTA.
 */
export function ProfileStatsBar({ stats, engagement }: ProfileStatsBarProps) {
  const t = useTranslations('publicPanel');
  const [following, setFollowing] = useState(false);

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 rounded-xl bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
        'dark:bg-home-search-category min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-6 min-[900px]:px-5'
      )}
    >
      {/* RTL: stats on the right */}
      <ul className="flex flex-wrap items-stretch justify-end divide-x divide-x-reverse divide-[#D1D5DB] dark:divide-border">
        {STAT_KEYS.map((key) => (
          <li
            key={key}
            className="flex min-w-[7.5rem] flex-col items-center justify-center gap-0.5 px-4 py-1 text-center"
          >
            <span className="text-base font-bold leading-6 text-content">
              {formatFaNumber(stats[key])}
            </span>
            <span className="text-xs font-medium leading-4 text-home-filter-muted">
              {t(`stats.${key}`)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 min-[900px]:justify-start min-[900px]:gap-6">
        <ul className="flex items-center gap-5 text-home-filter-ink">
          <li className="flex items-center gap-1.5 text-sm font-bold">
            <ThumbsUp className="size-5 text-primary" strokeWidth={1.5} />
            <span>{formatFaNumber(engagement.thumbsUp)}</span>
          </li>
          <li className="flex items-center gap-1.5 text-sm font-bold">
            <ThumbsDown className="size-5 text-primary" strokeWidth={1.5} />
            <span>{formatFaNumber(engagement.thumbsDown)}</span>
          </li>
          <li className="flex items-center gap-1.5 text-sm font-bold">
            <Share2 className="size-5 text-primary" strokeWidth={1.5} />
            <span>{formatFaNumber(engagement.shares)}</span>
          </li>
        </ul>

        <Button
          type="button"
          size="pillSm"
          variant={following ? 'outline' : 'default'}
          onClick={() => setFollowing((v) => !v)}
          className="h-10 min-w-[120px] rounded-full px-6"
        >
          {following ? t('following') : t('follow')}
        </Button>
      </div>
    </div>
  );
}
