import { getSession } from '@daneshjoam/auth';

import { PublicPanelView } from './components/view';

function parseActorId(raw: string | undefined): number | null {
  if (!raw) return null;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export default async function PublicPanelPage({
  searchParams,
}: {
  searchParams: Promise<{ actor_id?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const viewerActorId = parseActorId(session?.user?.id);
  const actorId = parseActorId(params.actor_id) ?? viewerActorId;

  return (
    <PublicPanelView
      accessToken={session?.accessToken}
      actorId={actorId}
      viewerActorId={viewerActorId}
    />
  );
}
