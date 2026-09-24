import { notFound } from 'next/navigation';

import { UiKitView } from '@/components/dev/ui-kit-view';

export default function UiKitPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <UiKitView />;
}
