'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import type { OtherInfoContent } from '@public-panel/data/public-panel-ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { EmptyState } from '../shared/empty-state';
import { TitleUnderline } from '../shared/title-underline';

type OtherInfoPanelProps = {
  content: OtherInfoContent;
};

const CARD_ELEVATION = 'shadow-home-elevation-1';

/** «سایر اطلاعات» — resume, portfolio, certificates (library node 2453:5976). */
export function OtherInfoPanel({ content }: OtherInfoPanelProps) {
  const t = useTranslations('publicPanel');
  const hasContent =
    Boolean(content.resume) ||
    content.portfolio.length > 0 ||
    content.certificates.length > 0;

  if (!hasContent) {
    return (
      <EmptyState
        message={t('emptyOther')}
        imageSrc="/images/public-panel/empty-state-alt.png"
        className="rounded-2xl bg-home-stat-card shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:bg-home-search-category"
      />
    );
  }

  return (
    <div dir="rtl" className="flex w-full flex-col gap-8 py-4">
      {content.resume ? (
        <OtherInfoSection title={t('otherInfo.resume')}>
          <div
            className={cn(
              'relative flex min-h-[184px] w-full flex-col gap-6 rounded-2xl border border-border bg-home-stat-card p-5',
              CARD_ELEVATION
            )}
          >
            <div className="flex items-start gap-4">
              <Image
                src="/images/public-panel/resume-pdf-thumb.png"
                alt=""
                width={104}
                height={144}
                className="h-[144px] w-[104px] shrink-0 rounded-lg object-contain"
              />

              <div className="flex min-w-0 flex-1 flex-col items-start gap-1 pt-2 text-start">
                <p className="w-full truncate text-base font-semibold leading-6 tracking-[0.0094em] text-home-filter-muted dark:text-home-filter-ink">
                  {content.resume.fileName}
                </p>
                <p className="w-full text-xs font-medium leading-5 tracking-[0.0083em] text-neutral-600 dark:text-home-filter-muted">
                  {content.resume.sizeLabel}
                  <span aria-hidden> {'  •  '} </span>
                  {t('otherInfo.updatedAt', { date: content.resume.updatedAt })}
                </p>
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
                <a href={content.resume.href} download>
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
              {content.resume.previewHref ? (
                <Button
                  asChild
                  variant="ghost"
                  className="h-12 rounded-full px-4 text-sm font-medium text-primary hover:bg-primary/10 hover:text-primary dark:text-primary-100 dark:hover:bg-primary-100/10 dark:hover:text-primary-100"
                >
                  <Link href={content.resume.previewHref}>
                    {t('otherInfo.preview')}
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </OtherInfoSection>
      ) : null}

      {content.portfolio.length > 0 ? (
        <OtherInfoSection title={t('otherInfo.portfolio')}>
          <ul
            dir="rtl"
            className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[960px]:grid-cols-3 min-[960px]:gap-6"
          >
            {content.portfolio.map((item) => (
              <li key={item.id} className="min-w-0">
                <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-home-card dark:bg-home-stat-card">
                  <div className="relative h-[188px] w-full shrink-0 overflow-hidden bg-home-search-category">
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 420px"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-0 p-4 text-start">
                    <h4 className="w-full text-base font-normal leading-6 tracking-[0.0094em] text-home-filter-ink">
                      {item.title}
                    </h4>
                    <p className="w-full text-sm font-normal leading-5 tracking-[0.0071em] text-neutral-600 dark:text-home-filter-muted">
                      {item.description}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </OtherInfoSection>
      ) : null}

      {content.certificates.length > 0 ? (
        <OtherInfoSection title={t('otherInfo.certificates')}>
          <ul
            dir="rtl"
            className={cn(
              'flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-home-stat-card',
              CARD_ELEVATION
            )}
          >
            {content.certificates.map((item, index) => (
              <li
                key={item.id}
                className={cn(
                  'flex min-h-[68px] items-center gap-3 px-6 py-4',
                  index < content.certificates.length - 1 &&
                    'border-b border-border'
                )}
              >
                <Image
                  src="/images/public-panel/cert-trophy.svg"
                  alt=""
                  width={22}
                  height={22}
                  className="size-[22px] shrink-0 dark:brightness-125"
                />
                <div className="flex min-w-0 flex-1 flex-col items-start gap-0 text-start">
                  <p className="w-full text-sm font-semibold leading-5 tracking-[0.0071em] text-home-filter-muted dark:text-home-filter-ink">
                    {item.title}
                  </p>
                  <p className="w-full text-xs font-medium leading-5 tracking-[0.0083em] text-neutral-600 dark:text-home-filter-muted">
                    {item.issuer}
                    <span aria-hidden> {'  •  '} </span>
                    {item.issuedAt}
                  </p>
                </div>
                {item.href ? (
                  <Link
                    href={item.href}
                    aria-label={t('otherInfo.viewCertificate')}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <Image
                      src="/images/public-panel/cert-eye.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 dark:opacity-80 dark:invert"
                    />
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </OtherInfoSection>
      ) : null}
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
      <div className="flex w-full justify-start">
        <div className="flex w-fit flex-col items-stretch gap-2 px-4">
          <h3 className="px-2 text-start text-[28px] font-bold leading-10 text-primary-700 dark:text-primary-100">
            {title}
          </h3>
          <TitleUnderline />
        </div>
      </div>
      {children}
    </section>
  );
}
