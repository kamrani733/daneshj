'use client';

import { useTranslations } from 'next-intl';

import { usePublicPanelProfileQuery } from '@public-panel/api';
import { EMPTY_PUBLIC_PANEL } from '@public-panel/data/public-panel-ui';
import type { PublicPanelKind } from '@public-panel/types/actor';

import { PanelLoadingOverlay, ProfileHeroCard } from '@/components/panel';

import { CommentsSection } from '@public-panel/components/comments/section';
import { PanelInfoBanner } from '@public-panel/components/profile/info-banner';
import { ProfileStatsBar } from '@public-panel/components/profile/stats-bar';
import { PublicPanelHeading } from '@public-panel/components/shared/heading';
import { RecordsAccordion } from '@public-panel/components/profile/records-accordion';
import { ServiceInfoSection } from '@public-panel/components/catalog/service-info-section';

type PublicPanelViewProps = {
  accessToken?: string | null;
  actorId?: number | null;
  actorType?: PublicPanelKind;
  viewerActorId?: number | null;
};

export function PublicPanelView({
  accessToken,
  actorId,
  actorType = 'user',
  viewerActorId,
}: PublicPanelViewProps) {
  const t = useTranslations('publicPanel');
  const profileQuery = usePublicPanelProfileQuery(
    accessToken,
    actorId,
    actorType
  );
  const profile = profileQuery.data ?? EMPTY_PUBLIC_PANEL;
  const isLoading =
    profileQuery.isFetching &&
    (profileQuery.isPlaceholderData || !profile.displayName);

  return (
    <main
      dir="rtl"
      className="relative mx-auto flex w-full max-w-[1322px] flex-col gap-8 bg-transparent px-4 py-6 min-[834px]:gap-12 min-[834px]:px-[95px] min-[834px]:py-8"
    >
      {isLoading ? <PanelLoadingOverlay message={t('loading')} /> : null}

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
