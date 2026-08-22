'use client';

import { CircleHelp, Info, UserCog } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { PrivatePanelTab } from '@private-panel/data/private-panel-ui';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import { FieldsSection } from './fields/fields-section';
import { GuideSection } from './guide/guide-section';
import { PublicOpsSection } from './public-ops/public-ops-section';

const TAB_ITEMS: {
  id: PrivatePanelTab;
  icon: typeof Info;
}[] = [
  { id: 'fields', icon: Info },
  { id: 'publicOps', icon: UserCog },
  { id: 'guide', icon: CircleHelp },
];

type PrivatePanelTabsProps = {
  accessToken?: string | null;
  targetActorId?: number | null;
};

export function PrivatePanelTabs({
  accessToken,
  targetActorId,
}: PrivatePanelTabsProps) {
  const t = useTranslations('privatePanel');

  return (
    <Tabs
      defaultValue="fields"
      className="flex w-full flex-col gap-6 min-[720px]:gap-8"
      dir="rtl"
    >
      <TabsList
        className={cn(
          'flex h-auto w-full items-center justify-between gap-1 rounded-[48px] p-3',
          'bg-[#efede6] dark:bg-home-stat-card',
          'min-[720px]:gap-2 min-[720px]:px-4 min-[720px]:py-3'
        )}
      >
        {TAB_ITEMS.map(({ id, icon: Icon }) => (
          <TabsTrigger
            key={id}
            value={id}
            className={cn(
              'h-auto min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full border-0 px-2 py-2',
              'text-[10px] font-bold leading-tight text-[#008d63] shadow-none',
              'hover:text-[#008d63] focus-visible:ring-primary/30',
              'data-[state=active]:bg-[#fafaf7] data-[state=active]:text-[#008d63]',
              'data-[state=active]:shadow-none',
              'dark:text-primary-100 dark:data-[state=active]:bg-home-card',
              'min-[720px]:h-12 min-[720px]:flex-row min-[720px]:gap-2',
              'min-[720px]:px-4 min-[720px]:text-lg min-[720px]:leading-6'
            )}
          >
            <Icon
              className="size-4 shrink-0 min-[720px]:size-6"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="max-w-full whitespace-normal text-center leading-snug min-[720px]:truncate min-[720px]:whitespace-nowrap">
              {t(`tabs.${id}`)}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="fields" className="mt-0">
        <FieldsSection accessToken={accessToken} targetActorId={targetActorId} />
      </TabsContent>
      <TabsContent value="publicOps" className="mt-0">
        <PublicOpsSection
          accessToken={accessToken}
          targetActorId={targetActorId}
        />
      </TabsContent>
      <TabsContent value="guide" className="mt-0">
        <GuideSection />
      </TabsContent>
    </Tabs>
  );
}
