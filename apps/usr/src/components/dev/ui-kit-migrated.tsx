'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function UiKitMigrated() {
  const t = useTranslations('uiKit');

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-title-large font-bold">{t('migrated')}</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="secondary">{t('secondaryButton')}</Button>
        <Badge variant="secondary">{t('secondaryBadge')}</Badge>
        <Input className="max-w-xs" placeholder={t('inputSample')} />
      </div>
    </section>
  );
}
