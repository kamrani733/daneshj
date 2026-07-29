'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { HOME_IMAGES } from '@home/home-assets';
import type { PublicPanelProfile } from '@public-panel/data/public-panel-mock';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { BorderedSectionCard } from './bordered-section-card';
import { SocialLinksRow } from './social-links-row';

type ProfileHeroCardProps = {
  profile: PublicPanelProfile;
};

/**
 * Figma About me=On, Provider=ON / node ~713:6234 profile header.
 * RTL: identity (avatar+meta) on the right · about + socials on the left.
 */
export function ProfileHeroCard({ profile }: ProfileHeroCardProps) {
  const t = useTranslations('publicPanel');
  const [expanded, setExpanded] = useState(false);
  const bioLong = profile.bio.length > 160;
  const bioText =
    !expanded && bioLong ? `${profile.bio.slice(0, 160)}…` : profile.bio;

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl bg-[#FCFAF7] shadow-[0_1px_3px_1px_rgba(0,0,0,0.08),0_1px_2px_0_rgba(0,0,0,0.12)]',
        'dark:bg-home-search-category'
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-20"
      >
        <Image
          src={HOME_IMAGES.bgPattern}
          alt=""
          fill
          sizes="1152px"
          className="object-cover object-left-top [filter:sepia(0.4)_hue-rotate(-15deg)_saturate(1.2)]"
        />
      </div>

      <div className="relative flex flex-col gap-6 p-5 min-[834px]:flex-row min-[834px]:items-center min-[834px]:gap-8 min-[834px]:p-8">
        {/* Identity — Figma right column */}
        <div className="flex min-w-0 shrink-0 items-start gap-5 min-[834px]:w-[340px]">
          <div className="relative shrink-0">
            <span className="absolute -top-1 end-0 z-10 whitespace-nowrap rounded-[4px] bg-warning px-2 py-1 text-[11px] font-medium leading-4 tracking-[0.0091em] text-white">
              {t(`providerBadge.${profile.providerBadgeKey}`)}
            </span>
            <Avatar className="size-[120px] ring-[3px] ring-[#F3D0C4] min-[834px]:size-[140px]">
              <AvatarImage src={profile.avatarSrc} alt={profile.displayName} />
              <AvatarFallback className="text-2xl">
                {profile.displayName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5 pt-5">
            <h2 className="text-xl font-bold leading-7 tracking-[0.0094em] text-primary-700 dark:text-primary-100 min-[834px]:text-[22px]">
              {profile.displayName}
            </h2>
            <p className="text-base font-normal leading-6 text-home-filter-muted">
              {profile.username}
            </p>
            <p className="text-sm font-medium leading-5 text-warning">
              {t(`role.${profile.roleLabelKey}`)}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs leading-4 text-content">
              <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} />
              <span>{profile.location}</span>
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-3 h-9 rounded-full border-[#BFC9C1] bg-white px-4 text-sm font-medium text-content shadow-none hover:bg-white dark:border-home-filter-border dark:bg-transparent"
            >
              <Link href={profile.electronicCardHref}>
                {t('viewElectronicCard')}
              </Link>
            </Button>
          </div>
        </div>

        {/* About + socials — Figma left column */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <BorderedSectionCard
            title={t('aboutMe')}
            className="border-primary/35 bg-white/80 dark:bg-home-card/40"
            footer={
              bioLong ? (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="text-sm font-medium text-warning hover:underline"
                >
                  {expanded ? t('seeLess') : t('seeMore')}
                </button>
              ) : (
                <span className="text-sm font-medium text-warning">
                  {t('seeMore')}
                </span>
              )
            }
          >
            <p className="text-sm leading-6 text-content">{bioText}</p>
          </BorderedSectionCard>
          <SocialLinksRow
            links={profile.socialLinks}
            variant="outline"
            className="justify-start gap-2.5"
          />
        </div>
      </div>
    </article>
  );
}
