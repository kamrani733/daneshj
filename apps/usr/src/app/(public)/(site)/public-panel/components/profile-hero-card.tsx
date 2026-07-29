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

const HERO_SURFACE = '#F9FAF4';

/**
 * Figma main top frame — identity · درباره من · socials.
 * Flat cream surface, no elevation shadow.
 */
export function ProfileHeroCard({ profile }: ProfileHeroCardProps) {
  const t = useTranslations('publicPanel');
  const [expanded, setExpanded] = useState(false);
  const bioLong = profile.bio.length > 140;
  const bioText =
    !expanded && bioLong ? `${profile.bio.slice(0, 140)}…` : profile.bio;

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[20px]',
        'dark:bg-home-search-category'
      )}
      style={{ backgroundColor: HERO_SURFACE }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] dark:opacity-15"
      >
        <Image
          src={HOME_IMAGES.bgPattern}
          alt=""
          fill
          sizes="1152px"
          className="object-cover object-left-top [filter:sepia(0.35)_hue-rotate(-12deg)_saturate(1.1)]"
        />
      </div>

      <div
        className={cn(
          'relative flex flex-col gap-5 px-5 py-5',
          'min-[834px]:flex-row min-[834px]:items-stretch min-[834px]:gap-7 min-[834px]:px-7 min-[834px]:py-6'
        )}
      >
        {/* Identity — Figma right */}
        <div className="flex min-w-0 shrink-0 items-start gap-4 min-[834px]:w-[332px] min-[834px]:gap-5">
          <div className="relative mt-1 shrink-0">
            <span
              className={cn(
                'absolute -top-1 end-0 z-10 whitespace-nowrap rounded-[4px] bg-warning',
                'px-2 py-[3px] text-[11px] font-medium leading-4 tracking-[0.0091em] text-white'
              )}
            >
              {t(`providerBadge.${profile.providerBadgeKey}`)}
            </span>
            <Avatar className="size-[112px] ring-[3px] ring-[#F3D0C4] min-[834px]:size-[128px]">
              <AvatarImage src={profile.avatarSrc} alt={profile.displayName} />
              <AvatarFallback className="text-2xl">
                {profile.displayName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start gap-1 pt-4">
            <h2 className="text-[20px] font-bold leading-7 tracking-[0.0094em] text-[#171D19] dark:text-primary-100 min-[834px]:text-[22px] min-[834px]:leading-8">
              {profile.displayName}
            </h2>
            <p className="text-[15px] font-normal leading-6 text-[#171D19] dark:text-content">
              {profile.username}
            </p>
            <p className="text-sm font-medium leading-5 text-warning">
              {t(`role.${profile.roleLabelKey}`)}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs leading-4 text-[#171D19] dark:text-content">
              <MapPin
                className="size-3.5 shrink-0 text-[#171D19]"
                strokeWidth={1.75}
                aria-hidden
              />
              <span>{profile.location}</span>
            </p>
            <Button
              asChild
              variant="outline"
              className={cn(
                'mt-3 h-9 rounded-full border-[#C5CDC6] bg-white px-4',
                'text-sm font-medium text-[#171D19] shadow-none',
                'hover:bg-white dark:border-home-filter-border dark:bg-transparent dark:text-content'
              )}
            >
              <Link href={profile.electronicCardHref}>
                {t('viewElectronicCard')}
              </Link>
            </Button>
          </div>
        </div>

        {/* About + socials — Figma left */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <BorderedSectionCard
            title={t('aboutMe')}
            titleBg={HERO_SURFACE}
            className="min-h-[148px] border-[#7AA898]/70 bg-transparent dark:border-primary/40"
            footer={
              <button
                type="button"
                onClick={() => bioLong && setExpanded((v) => !v)}
                className="text-sm font-medium text-warning hover:underline"
              >
                {expanded ? t('seeLess') : t('seeMore')}
              </button>
            }
          >
            <p className="text-sm leading-6 text-[#171D19] dark:text-content">
              {bioText}
            </p>
          </BorderedSectionCard>

          {/* Figma: social cluster bottom-left, LTR icon order */}
          <SocialLinksRow
            links={profile.socialLinks}
            variant="outline"
            size="sm"
            className="justify-end gap-2.5"
            dir="ltr"
          />
        </div>
      </div>
    </article>
  );
}
