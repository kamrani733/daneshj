'use client';

import { useTranslations } from 'next-intl';

import { usePrivatePanelProfileQuery } from '@private-panel/api';
import type { PrivatePanelProfile } from '@private-panel/data/private-panel-ui';
import { PanelLoadingOverlay, ProfileHeroCard } from '@/components/panel';

import { PrivatePanelHeading } from './page-heading';
import { PrivatePanelTabs } from './panel-tabs';

type PrivatePanelViewProps = {
  accessToken?: string | null;
  targetActorId?: number | null;
};

function temporaryAdminProfile(actorId: number): PrivatePanelProfile {
  return {
    displayName: `کاربر ${actorId}`,
    username: `user-${actorId}`,
    roleLabelKey: 'normal',
    location: '',
    bio: '',
    avatarSrc: '',
    electronicCardHref: '#',
    socialLinks: [],
  };
}

export function PrivatePanelView({
  accessToken,
  targetActorId,
}: PrivatePanelViewProps) {
  const t = useTranslations('privatePanel');
  const profileQuery = usePrivatePanelProfileQuery(accessToken, targetActorId);
  const profile =
    profileQuery.data ??
    (targetActorId ? temporaryAdminProfile(targetActorId) : undefined);
  const isLoading =
    profileQuery.isFetching &&
    (profileQuery.isPlaceholderData || !profile?.displayName);

  return (
    <main
      dir="rtl"
      className="relative mx-auto flex w-full max-w-[1312px] flex-col gap-6 bg-transparent px-4 py-4 min-[720px]:gap-8 min-[720px]:px-6 min-[720px]:py-6 min-[834px]:gap-8 min-[834px]:px-8 min-[834px]:py-8"
    >
      {isLoading ? <PanelLoadingOverlay message={t('loading')} /> : null}

      <PrivatePanelHeading displayName={profile?.displayName ?? ''} />
      {profile ? <ProfileHeroCard profile={profile} /> : null}
      <PrivatePanelTabs
        accessToken={accessToken}
        targetActorId={targetActorId}
        username={profile?.username || profile?.displayName || t('titleUserFallback')}
      />
    </main>
  );
}
