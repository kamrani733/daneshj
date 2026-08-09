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

const TAB_ITEMS: {
  id: PrivatePanelTab;
  icon: typeof Info;
}[] = [
  { id: 'fields', icon: Info },
  { id: 'publicOps', icon: UserCog },
  { id: 'guide', icon: CircleHelp },
];

/** Private panel primary tabs — pill bar matching Figma. */
export function PrivatePanelTabs() {
  const t = useTranslations('privatePanel');

  return (
    <Tabs defaultValue="guide" className="w-full gap-8" dir="rtl">
      <TabsList
        className={cn(
          'grid h-auto w-full grid-cols-3 gap-1 rounded-full p-1.5',
          'bg-home-search-category dark:bg-home-stat-card'
        )}
      >
        {TAB_ITEMS.map(({ id, icon: Icon }) => (
          <TabsTrigger
            key={id}
            value={id}
            className={cn(
              'h-12 gap-2 rounded-full border-0 border-b-0 px-3 pb-0 text-sm font-medium',
              'justify-center text-primary shadow-none',
              'hover:text-primary focus-visible:ring-primary/30',
              'data-[state=active]:border-0 data-[state=active]:bg-white',
              'data-[state=active]:text-primary data-[state=active]:shadow-none',
              'dark:text-primary-100 dark:data-[state=active]:bg-home-card dark:data-[state=active]:text-primary-100'
            )}
          >
            {/* RTL: first child sits on the right — icon beside title */}
            <Icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
            <span className="truncate">{t(`tabs.${id}`)}</span>
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
