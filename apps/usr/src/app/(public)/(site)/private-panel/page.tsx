import { getSession } from '@daneshjoam/auth';

import { PrivatePanelView } from './components/view';

function parseActorId(raw: string | undefined): number | null {
  if (!raw) return null;
  const match = raw.match(/\d+/);
  const value = match ? Number.parseInt(match[0], 10) : Number.NaN;
  return Number.isFinite(value) && value > 0 ? value : null;
}

export default async function PrivatePanelPage({
  searchParams,
}: {
  searchParams: Promise<{ actor_id?: string; actorId?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const targetActorId =
    parseActorId(params.actor_id) ?? parseActorId(params.actorId);

  return (
    <PrivatePanelView
      accessToken={session?.accessToken}
      targetActorId={targetActorId}
    />
  );
}
