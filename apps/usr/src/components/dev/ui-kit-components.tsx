'use client';

import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { CommentComposer } from '@/components/ui/comment-composer';
import { CountChip } from '@/components/ui/count-chip';
import { ErrorState } from '@/components/ui/error-state';
import { FeaturedBadge } from '@/components/ui/featured-badge';
import { GuestPromptState } from '@/components/ui/guest-prompt-state';
import { PriceDisplay } from '@/components/ui/price-display';
import { RatingStars } from '@/components/ui/rating-stars';
import { RepliesToggle } from '@/components/ui/replies-toggle';
import { SectionHeading } from '@/components/ui/section-heading';
import { SortMenu } from '@/components/ui/sort-menu';
import { StatItem } from '@/components/ui/stat-item';
import { formatFaNumber } from '@/lib/format-fa';

export function UiKitComponents() {
  const t = useTranslations('uiKit');
  const [draft, setDraft] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [repliesOpen, setRepliesOpen] = useState(false);

  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-title-large font-bold">{t('components')}</h2>

      <div className="flex flex-wrap items-center gap-4">
        <SectionHeading title={t('headingPrimary')} />
        <SectionHeading title={t('headingSecondary')} tone="brand-secondary" />
        <CountChip label={t('chipSample')} />
        <FeaturedBadge label={t('featured')} />
        <Badge variant="time">{t('timeChip')}</Badge>
        <Badge variant="viewcount">{t('viewChip')}</Badge>
        <RatingStars rating={4.6} reviewCount={12} />
        <PriceDisplay originalPrice="۱۲۰٬۰۰۰" finalPrice="۹۶٬۰۰۰" />
        <StatItem value={formatFaNumber(24)} label={t('statLabel')} icon={UserPlus} />
      </div>

      <SortMenu
        label={t('sortLabel')}
        value={sort}
        onChange={setSort}
        options={[
          { value: 'newest', label: t('sortNewest') },
          { value: 'oldest', label: t('sortOldest') },
        ]}
      />

      <RepliesToggle
        expanded={repliesOpen}
        onToggle={() => setRepliesOpen((open) => !open)}
        label={repliesOpen ? t('hideReplies') : t('showReplies')}
      />

      <CommentComposer
        value={draft}
        onChange={setDraft}
        onSubmit={() => setDraft('')}
        onCancel={() => setDraft('')}
        labels={{
          placeholder: t('composerPlaceholder'),
          submit: t('submit'),
          cancel: t('cancel'),
          charCount: t('charCount', {
            count: formatFaNumber(draft.length),
            max: formatFaNumber(1500),
          }),
        }}
      />

      <ErrorState message={t('errorSample')} retryLabel={t('retry')} onRetry={() => undefined} />
      <GuestPromptState message={t('guestSample')} loginLabel={t('login')} />
    </section>
  );
}
