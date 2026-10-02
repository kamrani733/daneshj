'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import type { OtherInfoContent } from '@public-panel/types/ui';
import { EmptyState } from '@/components/panel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { SectionHeading } from '@/components/ui/section-heading';

type OtherInfoPanelProps = {
  content: OtherInfoContent;
};

const CARD_ELEVATION = 'shadow-app-elevation-1';

/** «سایر اطلاعات» — résumé + portfolio file cards (Figma individual-provider export). */
export function OtherInfoPanel({ content }: OtherInfoPanelProps) {
  const t = useTranslations('publicPanel');
  // Certificates are not in the Figma tab or the Expectation report (no API field) — not shown.
  const hasContent = Boolean(content.resume) || content.portfolio.length > 0;

  if (!hasContent) {
    return (
      <EmptyState
        message={t('emptyOther')}
        imageSrc="/images/public-panel/empty-state-alt.png"
        className="rounded-2xl bg-app-stat-card shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-app-search-category"
      />
    );
  }

  return (
    <div dir="rtl" className="flex w-full flex-col gap-8 py-4">
      {content.resume ? (
        <OtherInfoSection title={t('otherInfo.resume')}>
          <OtherInfoFileCard
            fileName={content.resume.fileName}
            sizeLabel={content.resume.sizeLabel}
            updatedAt={content.resume.updatedAt}
            href={content.resume.href}
            previewHref={content.resume.previewHref}
          />
        </OtherInfoSection>
      ) : null}

      {content.portfolio.length > 0 ? (
        <OtherInfoSection title={t('otherInfo.portfolio')}>
          <ul className="flex w-full flex-col gap-4">
            {content.portfolio.map((item) => (
              <li key={item.id}>
                <OtherInfoFileCard
                  fileName={item.fileName || item.title}
                  sizeLabel={item.sizeLabel}
                  updatedAt={item.updatedAt}
                  href={item.href || item.imageSrc}
                  previewHref={item.href}
                  thumbnailSrc={isImageFile(item.imageSrc) ? item.imageSrc : undefined}
                  thumbnailAlt={item.title}
                />
              </li>
            ))}
          </ul>
        </OtherInfoSection>
      ) : null}
    </div>
  );
}

function isImageFile(path: string | undefined): path is string {
  return Boolean(path && /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(path));
}

/**
 * Résumé / portfolio file card (Figma «سایر اطلاعات»): thumbnail, file name,
 * size · updated date, «دانلود» + «پیش نمایش». Image portfolio files show as the thumbnail.
 */
function OtherInfoFileCard({
  fileName,
  sizeLabel,
  updatedAt,
  href,
  previewHref,
  thumbnailSrc,
  thumbnailAlt = '',
}: {
  fileName: string;
  sizeLabel?: string;
  updatedAt?: string;
  href: string;
  previewHref?: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
}) {
  const t = useTranslations('publicPanel');
  const meta = [
    sizeLabel,
    updatedAt ? t('otherInfo.updatedAt', { date: updatedAt }) : '',
  ].filter(Boolean);

  return (
    <div
      className={cn(
        'relative flex min-h-[184px] w-full flex-col gap-6 rounded-2xl border border-border bg-app-stat-card p-5',
        CARD_ELEVATION,
        'dark:border-warning-700 dark:bg-warning-800'
      )}
    >
      <div className="flex items-start gap-4">
        {thumbnailSrc ? (
          <div className="relative h-[144px] w-[104px] shrink-0 overflow-hidden rounded-lg bg-app-search-category">
            <Image
              src={thumbnailSrc}
              alt={thumbnailAlt}
              fill
              sizes="104px"
              className="object-cover"
            />
          </div>
        ) : (
          <Image
            src="/images/public-panel/resume-pdf-thumb.png"
            alt=""
            width={104}
            height={144}
            className="h-[144px] w-[104px] shrink-0 rounded-lg object-contain"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col items-start gap-1 pt-2 text-start">
          <p className="w-full truncate text-base font-semibold leading-6 tracking-[0.0094em] text-app-filter-muted dark:text-app-filter-ink">
            {fileName}
          </p>
          {meta.length > 0 ? (
            <p className="w-full text-xs font-medium leading-5 tracking-[0.0083em] text-neutral-600 dark:text-app-filter-muted">
              {meta.join('  •  ')}
            </p>
          ) : null}
        </div>
      </div>

      <div
        dir="ltr"
        className="flex items-center justify-start gap-5 min-[720px]:absolute min-[720px]:bottom-7 min-[720px]:left-5"
      >
        <Button
          asChild
          className="h-12 gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-100/90"
        >
          <a href={href} download>
            <Image
              src="/images/public-panel/resume-download.svg"
              alt=""
              width={20}
              height={20}
              className="size-5 dark:invert"
            />
            {t('otherInfo.download')}
          </a>
        </Button>
        {previewHref ? (
          <Button
            asChild
            variant="ghost"
            className="h-12 rounded-full px-4 text-sm font-medium text-primary hover:bg-primary/10 hover:text-primary dark:text-primary-100 dark:hover:bg-primary-100/10 dark:hover:text-primary-100"
          >
            <Link href={previewHref} target="_blank" rel="noopener noreferrer">
              {t('otherInfo.preview')}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function OtherInfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex w-full flex-col items-stretch gap-8">
      <SectionHeading
        title={title}
        tone="secondary"
        size="title"
        as="h3"
        align="start"
        className="self-start"
      />
      {children}
    </section>
  );
}
