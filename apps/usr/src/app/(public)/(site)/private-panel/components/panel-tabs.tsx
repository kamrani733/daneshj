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
};

/** Private panel primary tabs — pill bar matching Figma. */
export function PrivatePanelTabs({ accessToken }: PrivatePanelTabsProps) {
  const t = useTranslations('privatePanel');

  return (
    <Tabs
      defaultValue="publicOps"
      className="w-full gap-5 min-[720px]:gap-8"
      dir="rtl"
    >
      <TabsList
        className={cn(
          'grid h-auto w-full grid-cols-3 gap-0.5 rounded-full p-1',
          'bg-home-search-category dark:bg-home-stat-card',
          'min-[720px]:gap-1 min-[720px]:p-1.5'
        )}
      >
        {TAB_ITEMS.map(({ id, icon: Icon }) => (
          <TabsTrigger
            key={id}
            value={id}
            className={cn(
              'h-auto min-h-12 min-w-0 flex-col gap-1 rounded-full border-0 border-b-0 px-1.5 py-2',
              'text-[10px] font-medium leading-tight sm:text-[11px]',
              'min-[720px]:h-12 min-[720px]:flex-row min-[720px]:gap-2',
              'min-[720px]:px-3 min-[720px]:py-0 min-[720px]:text-sm min-[720px]:leading-4',
              'justify-center text-primary shadow-none',
              'hover:text-primary focus-visible:ring-primary/30',
              'data-[state=active]:border-0 data-[state=active]:bg-white',
              'data-[state=active]:text-primary data-[state=active]:shadow-none',
              'dark:text-primary-100 dark:data-[state=active]:bg-home-card dark:data-[state=active]:text-primary-100'
            )}
          >
            <Icon
              className="size-4 shrink-0 min-[720px]:size-5"
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
        <PlaceholderPanel message={t('placeholder.fields')} />
      </TabsContent>
      <TabsContent value="publicOps" className="mt-0">
        <PublicOpsSection accessToken={accessToken} />
      </TabsContent>
      <TabsContent value="guide" className="mt-0">
        <GuideSection />
      </TabsContent>
    </Tabs>
  );
}

function PlaceholderPanel({ message }: { message: string }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-border bg-home-card px-6 py-10 text-center text-sm text-home-filter-muted dark:bg-home-search-category">
      {message}
    </div>
  );
}
