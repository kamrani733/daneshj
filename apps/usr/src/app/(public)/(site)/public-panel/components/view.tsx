'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  usePublicPanelProfileQuery,
} from '@private-panel/api';
import { EMPTY_PUBLIC_PANEL } from '@public-panel/data/public-panel-ui';

import { ProfileHeroCard } from '@/components/panel';
import { cn } from '@/lib/utils';

import { CommentsSection } from './comments/section';
import { PanelInfoBanner } from './profile/info-banner';
import { ProfileStatsBar } from './profile/stats-bar';
import { PublicPanelHeading } from './shared/heading';
import { RecordsAccordion } from './profile/records-accordion';
import { ServiceInfoSection } from './catalog/service-info-section';

type PublicPanelViewProps = {
  accessToken?: string | null;
  actorId?: number | null;
  viewerActorId?: number | null;
};

/** Public panel page composition. */
export function PublicPanelView({
  accessToken,
  actorId,
  viewerActorId,
}: PublicPanelViewProps) {
  const t = useTranslations('publicPanel');
  const profileQuery = usePublicPanelProfileQuery(accessToken, actorId);
  const profile = profileQuery.data ?? EMPTY_PUBLIC_PANEL;
  const isLoading =
    profileQuery.isFetching &&
    (profileQuery.isPlaceholderData || !profile.displayName);

  return (
    <main
      dir="rtl"
      className="relative mx-auto flex w-full max-w-[1322px] flex-col gap-8 bg-transparent px-4 py-6 min-[834px]:gap-12 min-[834px]:px-[95px] min-[834px]:py-8"
    >
      {isLoading ? (
        <div
          className={cn(
            'absolute inset-0 z-20 flex min-h-[320px] flex-col items-center justify-center gap-3',
            'bg-home-scene/70 backdrop-blur-[1px]'
          )}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Loader2
            className="size-8 animate-spin text-[#008d63]"
            strokeWidth={2}
            aria-hidden
          />
          <p className="text-sm font-medium text-[#404943] dark:text-home-filter-muted">
            {t('loading')}
          </p>
        </div>
      ) : null}

      <PublicPanelHeading displayName={profile.displayName} />

      <div className="flex w-full flex-col gap-8 min-[834px]:gap-12">
        <ProfileHeroCard profile={profile} />
        <ProfileStatsBar
          profile={profile}
          accessToken={accessToken}
          viewerActorId={viewerActorId}
        />
        <PanelInfoBanner />
        <RecordsAccordion
          username={profile.username}
          records={profile.academicRecords}
          address={profile.educationAddress}
        />
      </div>

      <ServiceInfoSection
        links={profile.serviceSocialLinks}
        catalog={profile.serviceCatalog}
        otherInfo={profile.otherInfo}
      />
      <CommentsSection
        key={profile.actorId}
        username={profile.username}
        comments={profile.comments}
        accessToken={accessToken}
        viewerActorId={viewerActorId}
      />
    </main>
  );
}
