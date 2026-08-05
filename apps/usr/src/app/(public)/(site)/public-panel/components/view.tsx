'use client';

import type { PublicPanelProfile } from '@public-panel/data/public-panel-ui';

import { CommentsSection } from './comments/section';
import { PanelInfoBanner } from './profile/info-banner';
import { ProfileHeroCard } from './profile/hero-card';
import { ProfileStatsBar } from './profile/stats-bar';
import { PublicPanelHeading } from './shared/heading';
import { RecordsAccordion } from './profile/records-accordion';
import { ServiceInfoSection } from './catalog/service-info-section';

type PublicPanelViewProps = {
  profile: PublicPanelProfile;
  accessToken?: string | null;
  viewerActorId?: number | null;
};

/** Public panel page composition. */
export function PublicPanelView({
  profile,
  accessToken,
  viewerActorId,
}: PublicPanelViewProps) {
  return (
    <main
      dir="rtl"
      className="mx-auto flex w-full max-w-[1322px] flex-col gap-8 bg-transparent px-4 py-6 min-[834px]:gap-12 min-[834px]:px-[95px] min-[834px]:py-8"
    >
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
        username={profile.username}
        comments={profile.comments}
        accessToken={accessToken}
        viewerActorId={viewerActorId}
      />
    </main>
  );
}
