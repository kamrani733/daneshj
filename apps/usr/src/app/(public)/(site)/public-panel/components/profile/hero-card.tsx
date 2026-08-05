'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { PublicPanelProfile } from '@public-panel/data/public-panel-ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { BorderedSectionCard } from '../shared/bordered-section-card';
import { SocialLinksRow } from './social-links-row';

type ProfileHeroCardProps = {
  profile: PublicPanelProfile;
};

/** Profile identity, about section, and personal social links. */
export function ProfileHeroCard({ profile }: ProfileHeroCardProps) {
  const t = useTranslations('publicPanel');
  const [expanded, setExpanded] = useState(false);
  const bioLong = profile.bio.length > 180;
  const bioText =
    !expanded && bioLong ? `${profile.bio.slice(0, 180)}…` : profile.bio;

  return (
    <article
      className={cn(
        'relative w-full overflow-hidden rounded-[24px] bg-home-card',
        'shadow-home-elevation-2 dark:bg-home-search-category'
      )}
    >
      <Badge
        variant="warning"
        className={cn(
          'absolute start-0 top-[15px] z-20 h-[55px] rounded-none rounded-e-[10px]',
          'px-5 text-base font-semibold leading-6 tracking-[0.0094em]',
          'shadow-home-elevation-3'
        )}
      >
        {t(`providerBadge.${profile.providerBadgeKey}`)}
      </Badge>

      <div
        className={cn(
          'relative flex flex-col gap-4 px-4 py-4',
          'min-[834px]:gap-4 min-[834px]:px-[54px] min-[834px]:py-[17px]'
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-6',
            'min-[834px]:flex-row min-[834px]:items-center min-[834px]:justify-between min-[834px]:gap-7'
          )}
        >
          <div className="flex min-w-0 shrink-0 items-center gap-5 min-[834px]:gap-14">
            <div className="relative shrink-0">
              <Avatar className="size-[140px] ring-4 ring-warning-50 min-[834px]:size-[200px]">
                <AvatarImage src={profile.avatarSrc} alt={profile.displayName} />
                <AvatarFallback className="text-3xl">
                  {profile.displayName.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center">
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-[22px] font-bold leading-8 tracking-[0.0094em] text-content dark:text-primary-100 min-[834px]:text-[28px] min-[834px]:leading-10">
                  {profile.displayName}
                </h2>
                <p className="text-base font-bold leading-6 text-content min-[834px]:text-lg min-[834px]:leading-6">
                  {profile.username}
                </p>
                <Badge className="h-[34px] min-w-[118px] justify-center rounded-full border-0 bg-transparent px-3 text-[17px] font-medium leading-[27px] tracking-[0.0094em] text-warning">
                  {t(`role.${profile.roleLabelKey}`)}
                </Badge>
              </div>

              <div className="flex flex-col items-center gap-4">
                <p className="flex items-center gap-2 px-2 text-base font-medium leading-6 text-home-filter-muted dark:text-content">
                  <span>{profile.location}</span>
                  <MapPin
                    className="size-6 shrink-0 text-home-filter-muted"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </p>
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    'h-12 w-[169px] rounded-full border-border bg-home-scene px-4',
                    'text-sm font-medium text-home-filter-muted shadow-none',
                    'hover:bg-home-scene dark:border-home-filter-border dark:bg-transparent dark:text-content'
                  )}
                >
                  <Link href={profile.electronicCardHref}>
                    {t('viewElectronicCard')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <BorderedSectionCard
            title={t('aboutMe')}
            titleBgClassName="bg-home-scene"
            className={cn(
              'min-h-[148px] w-full border-primary-200/70 bg-home-card p-6 dark:border-primary/40',
              'min-[834px]:max-w-[590px] min-[834px]:flex-1'
            )}
            footer={
              <button
                type="button"
                onClick={() => bioLong && setExpanded((v) => !v)}
                className="text-xs font-medium leading-5 tracking-[0.0083em] text-warning hover:underline"
              >
                {expanded ? t('seeLess') : t('seeMore')}
              </button>
            }
          >
            <p className="text-justify text-sm font-medium leading-5 tracking-[0.0071em] text-content">
              {bioText}
            </p>
          </BorderedSectionCard>
        </div>

        <SocialLinksRow
          links={profile.socialLinks}
          variant="outline"
          size="md"
          className="justify-start gap-8"
          dir="ltr"
        />
      </div>
    </article>
  );
}
