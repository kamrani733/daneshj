'use client';

import { Clock, Eye, Heart, MoreVertical, UserPlus } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommentComposer } from '@/components/ui/comment-composer';
import { CommentItem } from '@/components/ui/comment-item';
import { CommentThread } from '@/components/ui/comment-thread';
import { CountChip } from '@/components/ui/count-chip';
import { ErrorState } from '@/components/ui/error-state';
import { FeaturedBadge } from '@/components/ui/featured-badge';
import { GuestPromptState } from '@/components/ui/guest-prompt-state';
import { PriceDisplay } from '@/components/ui/price-display';
import { RatingStars } from '@/components/ui/rating-stars';
import { RepliesToggle } from '@/components/ui/replies-toggle';
import { SearchField } from '@/components/ui/search-field';
import { SectionHeading } from '@/components/ui/section-heading';
import { SortMenu } from '@/components/ui/sort-menu';
import { StatItem } from '@/components/ui/stat-item';
import { formatFaNumber } from '@/lib/format-fa';

function UiKitBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-large border border-outline-variant bg-surface-container-lowest p-4">
      <h3 className="text-title-medium font-bold text-on-surface">{title}</h3>
      {children}
    </div>
  );
}

export function UiKitComponents() {
  const t = useTranslations('uiKit');
  const [draft, setDraft] = useState('');
  const [filledDraft, setFilledDraft] = useState(t('commentBodySample'));
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [repliesOpen, setRepliesOpen] = useState(true);

  const charCountLabel = (count: number) =>
    t('charCount', {
      count: formatFaNumber(count),
      max: formatFaNumber(1500),
    });

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-title-large font-bold">{t('components')}</h2>

      <UiKitBlock title={t('groupHeadings')}>
        <div className="flex flex-wrap items-center gap-6">
          <SectionHeading title={t('headingPrimary')} />
          <SectionHeading title={t('headingSecondary')} tone="secondary" />
          <CountChip label={t('chipSample')} />
          <StatItem value={formatFaNumber(24)} label={t('statLabel')} icon={UserPlus} />
        </div>
      </UiKitBlock>

      <UiKitBlock title={t('groupCatalog')}>
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="time">
            <Clock aria-hidden />
            {t('timeChip')}
          </Badge>
          <Badge variant="viewcount">
            {t('viewChip')}
            <Eye aria-hidden />
          </Badge>
          <RatingStars
            rating={4}
            reviewCountLabel={t('ratingReviews', { count: formatFaNumber(132) })}
          />
          <PriceDisplay
            layout="row"
            originalPrice="۱۲۰,۰۰۰"
            finalPrice="۸۴,۰۰۰ تومان"
          />
        </div>
      </UiKitBlock>

      <UiKitBlock title={t('groupCommentsChrome')}>
        <SearchField
          variant="panelComments"
          label={t('searchCommentsLabel')}
          placeholder={t('searchCommentsPlaceholder')}
          className="max-w-md"
        />
        <SortMenu
          label={t('sortLabel')}
          value={sort}
          onChange={setSort}
          options={[
            { value: 'newest', label: t('sortNewest') },
            { value: 'oldest', label: t('sortOldest') },
          ]}
        />
        <FeaturedBadge label={t('featured')} />
        <RepliesToggle
          expanded={repliesOpen}
          onToggle={() => setRepliesOpen((open) => !open)}
          label={repliesOpen ? t('hideReplies') : t('showReplies')}
        />
      </UiKitBlock>

      <UiKitBlock title={t('groupComposer')}>
        <p className="text-label-medium text-on-surface-variant">{t('composerCollapsed')}</p>
        <CommentComposer
          value=""
          onChange={() => undefined}
          onSubmit={() => undefined}
          onCancel={() => undefined}
          expanded={false}
          labels={{
            placeholder: t('composerPlaceholder'),
            submit: t('submit'),
            cancel: t('cancel'),
            charCount: charCountLabel(0),
          }}
        />
        <p className="text-label-medium text-on-surface-variant">{t('composerFocused')}</p>
        <CommentComposer
          value={draft}
          onChange={setDraft}
          onSubmit={() => setDraft('')}
          onCancel={() => setDraft('')}
          expanded
          labels={{
            placeholder: t('composerPlaceholder'),
            submit: t('submit'),
            cancel: t('cancel'),
            charCount: charCountLabel(draft.length),
          }}
        />
        <p className="text-label-medium text-on-surface-variant">{t('composerFilled')}</p>
        <CommentComposer
          value={filledDraft}
          onChange={setFilledDraft}
          onSubmit={() => setFilledDraft('')}
          onCancel={() => setFilledDraft('')}
          expanded
          labels={{
            placeholder: t('composerPlaceholder'),
            submit: t('submit'),
            cancel: t('cancel'),
            charCount: charCountLabel(filledDraft.length),
          }}
        />
      </UiKitBlock>

      <UiKitBlock title={t('groupCommentItem')}>
        <CommentItem
          variant="featured"
          featuredLabel={t('featured')}
          authorName={t('commentAuthorName')}
          username={t('commentUsername')}
          dateLabel={t('commentDate')}
          timeLabel={t('commentTime')}
          body={t('commentBodySample')}
          avatar={
            <Avatar className="size-12 bg-outline-variant">
              <AvatarFallback className="bg-outline-variant text-on-primary">
                {t('commentAvatarFallback')}
              </AvatarFallback>
            </Avatar>
          }
          menu={
            <Button type="button" variant="ghost" size="icon" aria-label={t('commentMenu')}>
              <MoreVertical className="size-4" aria-hidden />
            </Button>
          }
          actions={
            <Button type="button" variant="ghost" size="sm" className="gap-1 text-outline">
              <Heart className="size-5" aria-hidden />
              {formatFaNumber(18)}
            </Button>
          }
        />
        <CommentThread
          repliesToggle={
            <RepliesToggle
              expanded={repliesOpen}
              onToggle={() => setRepliesOpen((open) => !open)}
              label={t('showReplies')}
            />
          }
          replies={
            <CommentItem
              authorName={t('replyAuthorName')}
              username={t('replyUsername')}
              dateLabel={t('commentDate')}
              body={t('replyBodySample')}
              avatar={
                <Avatar className="size-10 bg-outline-variant">
                  <AvatarFallback className="bg-outline-variant text-on-primary text-label-small">
                    {t('replyAvatarFallback')}
                  </AvatarFallback>
                </Avatar>
              }
            />
          }
        >
          <CommentItem
            authorName={t('threadAuthorName')}
            username={t('threadUsername')}
            dateLabel={t('commentDate')}
            body={t('threadBodySample')}
            avatar={
              <Avatar className="size-12 bg-outline-variant">
                <AvatarFallback className="bg-outline-variant text-on-primary">
                  {t('threadAvatarFallback')}
                </AvatarFallback>
              </Avatar>
            }
          />
        </CommentThread>
      </UiKitBlock>

      <UiKitBlock title={t('groupStates')}>
        <ErrorState message={t('errorSample')} retryLabel={t('retry')} onRetry={() => undefined} />
        <GuestPromptState message={t('guestSample')} loginLabel={t('login')} />
      </UiKitBlock>
    </section>
  );
}
