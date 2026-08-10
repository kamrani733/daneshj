import { getSession } from '@daneshjoam/auth';

import { PrivatePanelView } from './components/view';

export default async function PrivatePanelPage() {
  const session = await getSession();

  return <PrivatePanelView accessToken={session?.accessToken} />;
}
