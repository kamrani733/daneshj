'use client';

import { useTranslations } from 'next-intl';

import type { PanelProfileIdentity } from '@/components/panel/types';
import { SITE_IMAGES } from '@/components/site/site-assets';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarUserIcon } from '@/components/ui/avatar-user-icon';
import { cn } from '@/lib/utils';

type IdentityBannerProps = {
  profile: PanelProfileIdentity;
};

export function PrivatePanelIdentityBanner({ profile }: IdentityBannerProps) {
  const t = useTranslations('panel');
  const hasAvatar =
    Boolean(profile.avatarSrc?.trim()) &&
    !profile.avatarSrc.includes('/images/public-panel/avatar.png');

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden rounded-[24px] bg-[#fafaf5]',
        'h-[220px] min-[720px]:h-[280px] min-[834px]:h-[358px]',
        'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]',
        'dark:bg-home-search-category'
      )}
    >
      <img
        src={SITE_IMAGES.introPatternRight}
        alt=""
        aria-hidden
        className={cn(
          'pointer-events-none absolute end-0 top-0 h-full w-auto',
          'max-w-[28%] object-cover object-left opacity-70',
          'min-[720px]:max-w-[22%]'
        )}
      />
      <img
        src={SITE_IMAGES.introPatternLeft}
        alt=""
        aria-hidden
        className={cn(
          'pointer-events-none absolute start-0 top-0 h-full w-auto',
          'max-w-[28%] object-cover object-right opacity-70',
          'min-[720px]:max-w-[22%]'
        )}
      />

      <div
        className={cn(
          'relative z-10 flex h-full items-center justify-center px-4',
          'min-[720px]:px-10 min-[834px]:px-[54px]'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-5',
            'min-[720px]:gap-10 min-[834px]:gap-14'
          )}
        >
          <Avatar
            className={cn(
              'size-[112px] shrink-0 bg-[#efede7] ring-4 ring-[#ffdbcf]',
              'min-[720px]:size-[160px]',
              'min-[834px]:size-[200px]'
            )}
          >
            {hasAvatar ? (
              <AvatarImage src={profile.avatarSrc} alt={profile.displayName} />
            ) : null}
            <AvatarFallback className="bg-[#efede7] text-[#7a807a] dark:bg-home-stat-card dark:text-home-filter-muted">
              <AvatarUserIcon className="size-14 min-[720px]:size-[72px] min-[834px]:size-20" />
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <h2
              className={cn(
                'text-xl font-bold leading-8 text-[#171d19]',
                'min-[720px]:text-[28px] min-[720px]:leading-10',
                'dark:text-primary-100'
              )}
            >
              {profile.displayName || '\u00a0'}
            </h2>
            {profile.username ? (
              <p
                className={cn(
                  'text-base font-bold leading-6 text-[#171d19]',
                  'min-[720px]:text-lg min-[720px]:leading-6',
                  'dark:text-home-filter-ink'
                )}
              >
                {profile.username}
              </p>
            ) : null}
            <span
              className={cn(
                'inline-flex h-7 min-w-24 items-center justify-center rounded-full px-3',
                'text-sm font-medium tracking-[0.009em] text-[#404943]',
                'min-[720px]:h-[34px] min-[720px]:min-w-[118px] min-[720px]:text-[18px]',
                'dark:text-home-filter-muted'
              )}
            >
              {t(`role.${profile.roleLabelKey}`)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
