import { MOCK_PRIVATE_PANEL } from '@private-panel/data/private-panel-mock';

import { PrivatePanelView } from './components/view';

export default function PrivatePanelPage() {
  return <PrivatePanelView initialProfile={MOCK_PRIVATE_PANEL} />;
}
