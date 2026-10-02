'use client';

import { useTranslations } from 'next-intl';

import { usePublicPanelProfileQuery } from '@public-panel/api';
import { EMPTY_PUBLIC_PANEL } from '@public-panel/data/public-panel-ui';
import type { PublicPanelKind } from '@public-panel/types/actor';

import { PanelLoadingOverlay, ProfileHeroCard } from '@/components/panel';
import { ErrorState } from '@/components/ui/error-state';

import { CommentsSection } from '@public-panel/components/comments/section';
import { PublicPanelDemoBanner } from '@public-panel/components/demo-mode/public-panel-demo-banner';
import { usePublicPanelDemoMode } from '@public-panel/components/demo-mode/public-panel-demo-provider';
import { PanelInfoBanner } from '@public-panel/components/profile/info-banner';
import { ProfileStatsBar } from '@public-panel/components/profile/stats-bar';
import { GuestAccessProvider } from '@public-panel/components/shared/guest-access-dialog';
import { PublicPanelHeading } from '@public-panel/components/shared/heading';
import { RecordsAccordion } from '@public-panel/components/profile/records-accordion';
import { ServiceInfoSection } from '@public-panel/components/catalog/service-info-section';
import { usePublicPanelCapabilities } from '@public-panel/hooks/use-public-panel-capabilities';
import { usePublicPanelViewer } from '@public-panel/hooks/use-public-panel-viewer';

type PublicPanelViewProps = {
  accessToken?: string | null;
  actorId?: number | null;
  actorType?: PublicPanelKind;
  viewerActorId?: number | null;
  viewerIsAdmin?: boolean;
};

export function PublicPanelView({
  accessToken,
  actorId,
  actorType = 'user',
  viewerActorId,
  viewerIsAdmin = false,
}: PublicPanelViewProps) {
  const t = useTranslations('publicPanel');
  const demoMode = usePublicPanelDemoMode();
  const profileQuery = usePublicPanelProfileQuery(
    accessToken,
    actorId,
    actorType
  );
  const profile = profileQuery.data ?? EMPTY_PUBLIC_PANEL;
  const viewer = usePublicPanelViewer(
    { accessToken, viewerActorId, viewerIsAdmin },
    profile.actorId
  );
  const capabilities = usePublicPanelCapabilities(profile, viewer);

  const isLoading =
    !demoMode &&
    profileQuery.isFetching &&
    (profileQuery.isPlaceholderData || !profile.displayName);

  return (
    <GuestAccessProvider>
      <PublicPanelDemoBanner />
      <main
        dir="rtl"
        className="relative mx-auto flex w-full max-w-[1322px] flex-col gap-8 bg-transparent px-4 py-6 min-[834px]:gap-12 min-[834px]:px-[95px] min-[834px]:py-8"
      >
        {isLoading ? <PanelLoadingOverlay message={t('loading')} /> : null}
        {profileQuery.isError && !isLoading && !demoMode ? (
          <ErrorState
            message={t('loadError')}
            retryLabel={t('retry')}
            onRetry={() => void profileQuery.refetch()}
          />
        ) : null}

        <PublicPanelHeading displayName={profile.displayName} />

        <div className="flex w-full flex-col gap-8 min-[834px]:gap-12">
          <ProfileHeroCard profile={profile} />
          <ProfileStatsBar
            profile={profile}
            accessToken={viewer.accessToken}
            viewerActorId={viewer.viewerActorId}
            capabilities={capabilities}
          />
          <PanelInfoBanner />
          <RecordsAccordion
            username={profile.username}
            records={profile.academicRecords}
            address={profile.educationAddress}
          />
        </div>

        {capabilities.showServiceInfoSection ? (
          <ServiceInfoSection
            links={profile.serviceSocialLinks}
            catalog={profile.serviceCatalog}
            otherInfo={profile.otherInfo}
          />
        ) : null}
        <CommentsSection
          key={`${profile.actorId}-${capabilities.commentComposerMode}`}
          username={profile.username}
          comments={profile.comments}
          accessToken={viewer.accessToken}
          viewerActorId={viewer.viewerActorId}
          capabilities={capabilities}
        />
      </main>
    </GuestAccessProvider>
  );
}
