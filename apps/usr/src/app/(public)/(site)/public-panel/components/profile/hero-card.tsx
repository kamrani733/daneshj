'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { PublicPanelProfile } from '@public-panel/data/public-panel-ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { BorderedSectionCard } from '../shared/bordered-section-card';
import { SocialLinksRow } from './social-links-row';

type ProfileHeroCardProps = {
  profile: PublicPanelProfile;
};

const HERO_SURFACE = '#FAFAF5';
const ABOUT_TITLE_BG = '#FAFAF7';

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
        'relative w-full overflow-hidden rounded-[24px]',
        'shadow-[0px_2px_6px_2px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.3)]',
        'dark:bg-home-search-category'
      )}
      style={{ backgroundColor: HERO_SURFACE }}
    >
      <div
        className={cn(
          'absolute start-0 top-[15px] z-20 flex h-[55px] items-center',
          'rounded-e-[10px] bg-[#E06333] pe-4 ps-5',
          'shadow-[0px_1.23px_3.7px_0px_rgba(0,0,0,0.3),0px_4.94px_9.87px_3.7px_rgba(0,0,0,0.15)]'
        )}
      >
        <span className="text-base font-semibold leading-6 tracking-[0.0094em] text-white">
          {t(`providerBadge.${profile.providerBadgeKey}`)}
        </span>
      </div>

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
              <Avatar className="size-[140px] ring-4 ring-[#FFDBCF] min-[834px]:size-[200px]">
                <AvatarImage src={profile.avatarSrc} alt={profile.displayName} />
                <AvatarFallback className="text-3xl">
                  {profile.displayName.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center">
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-[22px] font-bold leading-8 tracking-[0.0094em] text-[#171D19] dark:text-primary-100 min-[834px]:text-[28px] min-[834px]:leading-10">
                  {profile.displayName}
                </h2>
                <p className="text-base font-bold leading-6 text-[#171D19] dark:text-content min-[834px]:text-lg min-[834px]:leading-6">
                  {profile.username}
                </p>
                <span className="inline-flex h-[34px] min-w-[118px] items-center justify-center rounded-full px-3 text-[17px] font-medium leading-[27px] tracking-[0.0094em] text-[#E06333]">
                  {t(`role.${profile.roleLabelKey}`)}
                </span>
              </div>

              <div className="flex flex-col items-center gap-4">
                <p className="flex items-center gap-2 px-2 text-base font-medium leading-6 text-[#404943] dark:text-content">
                  <span>{profile.location}</span>
                  <MapPin
                    className="size-6 shrink-0 text-[#404943]"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </p>
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    'h-12 w-[169px] rounded-full border-[#BFC9C1] bg-[#FAFAF7] px-4',
                    'text-sm font-medium text-[#404943] shadow-none',
                    'hover:bg-[#FAFAF7] dark:border-home-filter-border dark:bg-transparent dark:text-content'
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
            titleBg={ABOUT_TITLE_BG}
            className={cn(
              'min-h-[148px] w-full border-[rgba(141,213,178,0.7)] bg-[#FAFAF5] p-6 dark:border-primary/40',
              'min-[834px]:max-w-[590px] min-[834px]:flex-1'
            )}
            footer={
              <button
                type="button"
                onClick={() => bioLong && setExpanded((v) => !v)}
                className="text-xs font-medium leading-5 tracking-[0.0083em] text-[#E06333] hover:underline"
              >
                {expanded ? t('seeLess') : t('seeMore')}
              </button>
            }
          >
            <p className="text-justify text-sm font-medium leading-5 tracking-[0.0071em] text-[#171D19] dark:text-content">
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
