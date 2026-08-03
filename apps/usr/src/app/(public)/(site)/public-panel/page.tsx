import { getSession } from '@daneshjoam/auth';

import { MOCK_PUBLIC_PANEL } from '@public-panel/data/public-panel-mock';

import { PublicPanelView } from './components/view';

export default async function PublicPanelPage() {
  const session = await getSession();
  const viewerActorId = session?.user.id
    ? Number.parseInt(session.user.id, 10)
    : null;

  return (
    <PublicPanelView
      profile={MOCK_PUBLIC_PANEL}
      accessToken={session?.accessToken}
      viewerActorId={
        viewerActorId != null && Number.isFinite(viewerActorId)
          ? viewerActorId
          : null
      }
    />
  );
}
