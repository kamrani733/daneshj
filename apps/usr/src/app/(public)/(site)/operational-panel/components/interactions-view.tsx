'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { OperationalShell } from '@operational-panel/components/operational-shell';
import { OperationalReportPanel } from '@operational-panel/components/report-panel';
import type { OperationalReportId } from '@operational-panel/types';

const TABS = [
  { value: 'by', reportId: 'interactionsByActor' },
  { value: 'to', reportId: 'interactionsToActor' },
] as const satisfies ReadonlyArray<{ value: string; reportId: OperationalReportId }>;

type InteractionsTab = (typeof TABS)[number]['value'];

const TAB_PARAM = 'tab';

/**
 * `/operational-panel/interactions` — export «Notifications» (tablet frame): «تعاملات از عملگر» /
 * «تعاملات به عملگر» tabs, each one collapsible report. The tab lives in `?tab=` (`by` is the default).
 */
export function OperationalInteractionsView({ displayName }: { displayName?: string }) {
  const t = useTranslations('operationalPanel.interactions');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab: InteractionsTab = searchParams.get(TAB_PARAM) === 'to' ? 'to' : 'by';

  const changeTab = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === 'to') next.set(TAB_PARAM, value);
    else next.delete(TAB_PARAM);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <OperationalShell section="interactions" displayName={displayName}>
      {/* Desktop frame only (Figma 890:65464); the tablet frame starts with the tabs. */}
      <p className="hidden px-2 text-body-large text-on-surface-variant lg:block">{t('intro')}</p>
      <Tabs value={tab} onValueChange={changeTab} dir="rtl" className="gap-4">
        <TabsList aria-label={t('tabsLabel')} className="gap-0 self-start border-b border-outline-variant">
          {TABS.map(({ value }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="mb-[-1px] border-b-3 px-4 py-3 font-medium text-on-surface-variant hover:text-on-surface data-[state=active]:font-bold data-[state=active]:text-on-surface"
            >
              {/* Size outside `cn()`: tailwind-merge reads M3 sizes as colours (09-known-issues). */}
              <span className="text-title-small">{t(`tabs.${value}`)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(({ value, reportId }) => (
          <TabsContent key={value} value={value} className="flex flex-col">
            <OperationalReportPanel reportId={reportId} />
          </TabsContent>
        ))}
      </Tabs>
    </OperationalShell>
  );
}
