'use client';

import { ProfileHeroCard } from '@/components/panel';
import { usePrivatePanelProfileQuery } from '@private-panel/api';
import type { PrivatePanelProfile } from '@private-panel/data/private-panel-ui';

import { PrivatePanelHeading } from './page-heading';
import { PrivatePanelTabs } from './panel-tabs';

type PrivatePanelViewProps = {
  initialProfile: PrivatePanelProfile;
};

/** Private panel page composition. */
export function PrivatePanelView({ initialProfile }: PrivatePanelViewProps) {
  const profileQuery = usePrivatePanelProfileQuery(initialProfile);
  const profile = profileQuery.data ?? initialProfile;

  return (
    <main
      dir="rtl"
      className="mx-auto flex w-full max-w-[1322px] flex-col gap-5 bg-transparent px-4 py-4 min-[720px]:gap-8 min-[720px]:px-6 min-[720px]:py-6 min-[834px]:gap-12 min-[834px]:px-[95px] min-[834px]:py-8"
    >
      <PrivatePanelHeading displayName={profile.displayName} />
      <ProfileHeroCard profile={profile} />
      <PrivatePanelTabs />
    </main>
  );
}
