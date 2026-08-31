import { getSession } from '@daneshjoam/auth';

import { parsePublicPanelKind } from '@public-panel/types/actor';

import { PublicPanelView } from './components/view';

function parseActorId(raw: string | undefined): number | null {
  if (!raw) return null;
  const match = raw.match(/\d+/);
  const value = match ? Number.parseInt(match[0], 10) : Number.NaN;
  return Number.isFinite(value) && value > 0 ? value : null;
}

export default async function PublicPanelPage({
  searchParams,
}: {
  searchParams: Promise<{ actor_id?: string; actor_type?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const viewerActorId = parseActorId(session?.user?.id);
  const actorId = parseActorId(params.actor_id) ?? viewerActorId;

  return (
    <PublicPanelView
      accessToken={session?.accessToken}
      actorId={actorId}
      actorType={parsePublicPanelKind(params.actor_type)}
      viewerActorId={viewerActorId}
    />
  );
}
