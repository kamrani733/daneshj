'use client';

import type { PublicPanelProfile } from '@public-panel/data/public-panel-mock';

import { CommentsSection } from './comments-section';
import { PanelInfoBanner } from './panel-info-banner';
import { ProfileHeroCard } from './profile-hero-card';
import { ProfileStatsBar } from './profile-stats-bar';
import { PublicPanelHeading } from './public-panel-heading';
import { RecordsAccordion } from './records-accordion';
import { ServiceInfoSection } from './service-info-section';

type PublicPanelViewProps = {
  profile: PublicPanelProfile;
};

/**
 * Public panel composition — Figma content frame (filled mock).
 * SiteShell still renders the footer motivation box separately.
 */
export function PublicPanelView({ profile }: PublicPanelViewProps) {
  return (
    <main
      dir="rtl"
      className="mx-auto flex w-full max-w-[1152px] flex-col gap-5 bg-transparent px-4 py-6 min-[834px]:gap-6 min-[834px]:px-8 min-[834px]:py-8"
    >
      <PublicPanelHeading displayName={profile.displayName} />
      <ProfileHeroCard profile={profile} />
      <ProfileStatsBar
        stats={profile.stats}
        engagement={profile.engagement}
      />
      <PanelInfoBanner />
      <RecordsAccordion
        username={profile.displayName}
        records={profile.academicRecords}
      />
      <ServiceInfoSection
        links={profile.serviceSocialLinks}
        catalog={profile.serviceCatalog}
        otherInfo={profile.otherInfo}
      />
      <CommentsSection comments={profile.comments} />
    </main>
  );
}
