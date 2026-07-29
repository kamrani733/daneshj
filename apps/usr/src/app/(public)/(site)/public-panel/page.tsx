import { MOCK_PUBLIC_PANEL } from '@public-panel/data/public-panel-mock';

import { PublicPanelView } from './components/public-panel-view';

/** Public panel — Figma #731:60779 (content) / #713:5441 (empty fallbacks). */
export default function PublicPanelPage() {
  return <PublicPanelView profile={MOCK_PUBLIC_PANEL} />;
}
