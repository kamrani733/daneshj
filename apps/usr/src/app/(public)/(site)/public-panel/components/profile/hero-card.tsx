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

  const showProvider = Boolean(profile.providerBadgeKey);
  const showAbout = Boolean(profile.bio.trim());
  const showLocation = Boolean(profile.location.trim());
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
      {showProvider ? (
        <Badge
          variant="warning"
          className={cn(
            'absolute start-0 top-3 z-20 h-10 rounded-none rounded-e-[10px]',
            'px-3 text-xs font-semibold leading-5 tracking-[0.0094em]',
            'shadow-home-elevation-3',
            'min-[834px]:top-[15px] min-[834px]:h-[55px] min-[834px]:px-5 min-[834px]:text-base min-[834px]:leading-6'
          )}
        >
          {t(`providerBadge.${profile.providerBadgeKey}`)}
        </Badge>
      ) : null}

      <div
        className={cn(
          'relative flex flex-col items-center gap-5 px-4 py-6',
          'min-[834px]:gap-6 min-[834px]:px-[54px] min-[834px]:py-8'
        )}
      >
        {/* Identity block — always centered stack on mobile; desktop splits when about exists */}
        <div
          className={cn(
            'flex w-full flex-col items-center gap-5',
            showAbout &&
              'min-[834px]:flex-row min-[834px]:items-center min-[834px]:justify-between min-[834px]:gap-7'
          )}
        >
          <div
            className={cn(
              'flex w-full flex-col items-center gap-4',
              showAbout && 'min-[834px]:w-auto min-[834px]:shrink-0 min-[834px]:flex-row min-[834px]:gap-10'
            )}
          >
            <Avatar
              className={cn(
                'size-[120px] ring-[3px] ring-warning-50',
                'min-[834px]:size-[160px] min-[834px]:ring-4',
                showAbout && 'min-[1100px]:size-[200px]'
              )}
            >
              <AvatarImage src={profile.avatarSrc} alt={profile.displayName} />
              <AvatarFallback className="text-3xl">
                {profile.displayName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>

            <div className="flex w-full min-w-0 flex-col items-center gap-3 text-center">
              <div className="flex flex-col items-center gap-2 min-[834px]:gap-3">
                <h2 className="text-xl font-bold leading-8 tracking-[0.0094em] text-content dark:text-primary-100 min-[834px]:text-[28px] min-[834px]:leading-10">
                  {profile.displayName}
                </h2>
                <p className="text-sm font-medium leading-6 text-content min-[834px]:text-lg min-[834px]:font-bold">
                  {profile.username}
                </p>
                <span className="text-base font-medium leading-6 text-warning min-[834px]:text-[17px]">
                  {t(`role.${profile.roleLabelKey}`)}
                </span>
              </div>

              {showLocation ? (
                <p className="flex items-center justify-center gap-2 px-2 text-sm font-medium leading-6 text-home-filter-muted dark:text-content min-[834px]:text-base">
                  <span>{profile.location}</span>
                  <MapPin
                    className="size-5 shrink-0 text-home-filter-muted min-[834px]:size-6"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </p>
              ) : null}

              <Button
                asChild
                variant="outline"
                className={cn(
                  'h-11 w-full max-w-[240px] rounded-full border-border bg-home-scene px-4',
                  'text-sm font-medium text-home-filter-muted shadow-none',
                  'hover:bg-home-scene dark:border-home-filter-border dark:bg-transparent dark:text-content',
                  'min-[834px]:h-12 min-[834px]:w-auto min-[834px]:min-w-[169px]'
                )}
              >
                <Link href={profile.electronicCardHref}>
                  {t('viewElectronicCard')}
                </Link>
              </Button>
            </div>
          </div>

          {showAbout ? (
            <BorderedSectionCard
              title={t('aboutMe')}
              titleBgClassName="bg-home-card"
              className={cn(
                'min-h-[120px] w-full border-primary-200/70 bg-home-card p-4 dark:border-primary/40',
                'min-[834px]:min-h-[148px] min-[834px]:max-w-[590px] min-[834px]:flex-1 min-[834px]:p-6'
              )}
              footer={
                bioLong ? (
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="text-xs font-medium leading-5 tracking-[0.0083em] text-warning hover:underline"
                  >
                    {expanded ? t('seeLess') : t('seeMore')}
                  </button>
                ) : null
              }
            >
              <p className="text-justify text-sm font-medium leading-5 tracking-[0.0071em] text-content">
                {bioText}
              </p>
            </BorderedSectionCard>
          ) : null}
        </div>

        <SocialLinksRow
          links={profile.socialLinks}
          variant="outline"
          size="md"
          className="justify-center gap-4 min-[834px]:gap-6"
          dir="ltr"
        />
      </div>
    </article>
  );
}
