'use client';

import {
  CircleHelp,
  ClipboardList,
  Settings2,
} from 'lucide-react';
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

const TAB_ITEMS: {
  id: PrivatePanelTab;
  icon: typeof ClipboardList;
}[] = [
  { id: 'fields', icon: ClipboardList },
  { id: 'publicOps', icon: Settings2 },
  { id: 'guide', icon: CircleHelp },
];

/** Private panel primary tabs. */
export function PrivatePanelTabs() {
  const t = useTranslations('privatePanel');

  return (
    <Tabs defaultValue="guide" className="w-full gap-8" dir="rtl">
      <TabsList
        className={cn(
          'flex h-auto w-full flex-wrap items-center justify-start gap-2',
          'rounded-2xl bg-home-card p-2 shadow-home-elevation-1 dark:bg-home-search-category'
        )}
      >
        {TAB_ITEMS.map(({ id, icon: Icon }) => (
          <TabsTrigger
            key={id}
            value={id}
            className={cn(
              'h-11 gap-2 rounded-xl border-0 px-4 text-sm font-medium',
              'text-home-filter-muted data-[state=active]:bg-home-scene',
              'data-[state=active]:text-primary data-[state=active]:shadow-none',
              'dark:data-[state=active]:bg-home-stat-card dark:data-[state=active]:text-primary-100'
            )}
          >
            <Icon className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
            {t(`tabs.${id}`)}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="fields" className="mt-0">
        <PlaceholderPanel message={t('placeholder.fields')} />
      </TabsContent>
      <TabsContent value="publicOps" className="mt-0">
        <PlaceholderPanel message={t('placeholder.publicOps')} />
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
