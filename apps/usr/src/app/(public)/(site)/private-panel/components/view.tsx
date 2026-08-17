'use client';

import { usePrivatePanelProfileQuery } from '@private-panel/api';
import { ProfileHeroCard } from '@/components/panel';

import { PrivatePanelHeading } from './page-heading';
import { PrivatePanelTabs } from './panel-tabs';

type PrivatePanelViewProps = {
  accessToken?: string | null;
};
export function PrivatePanelView({ accessToken }: PrivatePanelViewProps) {
  const profileQuery = usePrivatePanelProfileQuery(accessToken);
  const profile = profileQuery.data;

  return (
    <main
      dir="rtl"
      className="mx-auto flex w-full max-w-[1312px] flex-col gap-6 bg-transparent px-4 py-4 min-[720px]:gap-8 min-[720px]:px-6 min-[720px]:py-6 min-[834px]:gap-8 min-[834px]:px-8 min-[834px]:py-8"
    >
      <PrivatePanelHeading displayName={profile?.displayName ?? ''} />
      {profile ? <ProfileHeroCard profile={profile} /> : null}
      <PrivatePanelTabs accessToken={accessToken} />
    </main>
  );
}
