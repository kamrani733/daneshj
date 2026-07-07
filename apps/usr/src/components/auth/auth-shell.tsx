'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import localFont from 'next/font/local';
import { useTranslations } from 'next-intl';
import { useSyncExternalStore } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { AuthPageBackground, FormPattern } from './auth-background';
import {
  FIGMA_CARD_GRID,
  FIGMA_LOGIN_PANEL,
  MAZE_LINES,
  MAZE_LINES_BLUE,
  cardSlotStyle,
  type CardSlot,
} from './auth-scene-assets';

const lalezar = localFont({
  src: '../../../public/fonts/Lalezar-Regular.ttf',
  display: 'swap',
  weight: '400',
});

function useIsLg() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia('(min-width: 1024px)');
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false
  );
}

export type AuthCardStep = 'identifier' | 'otp';

type AuthShellProps = {
  children: React.ReactNode;
  backHref?: string;
  step?: AuthCardStep;
};

type CardId = 'glass-1' | 'logo' | 'green' | 'blue' | 'peach' | 'glass-2';

const SLOTS: Record<AuthCardStep, Record<CardId, CardSlot>> = {
  identifier: {
    'glass-1': { col: 0, row: 0 },
    logo: { col: 1, row: 0 },
    green: { col: 0, row: 1 },
    blue: { col: 1, row: 1 },
    peach: { col: 0, row: 2 },
    'glass-2': { col: 1, row: 2 },
  },
  otp: {
    peach: { col: 0, row: 0 },
    green: { col: 1, row: 0 },
    'glass-1': { col: 0, row: 1 },
    'glass-2': { col: 1, row: 1 },
    blue: { col: 0, row: 2 },
    logo: { col: 1, row: 2 },
  },
};

function GlassCard() {
  return (
    <div >
      <div />
    </div>
  );
}

function MazeTile({
  bg,
  lines,
  linesTone = 'green',
  linesPosition = 'bottom',
  variant,
  children,
}: {
  bg: string;
  lines: string;
  linesTone?: 'green' | 'blue';
  linesPosition?: 'top' | 'bottom';
  variant?: 'logo' | 'peach';
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'auth-cube-tile relative flex size-full flex-col items-center justify-center overflow-hidden rounded-[30px] p-5',
        variant === 'logo' && 'auth-cube-tile--logo',
        variant === 'peach' && 'auth-cube-tile--peach',
        bg
      )}
    >
      <div
        aria-hidden
        className={cn(
          'auth-cube-lines pointer-events-none absolute inset-x-0 h-[58%]',
          linesTone === 'blue' ? 'auth-cube-lines--blue' : 'auth-cube-lines--green',
          linesPosition === 'top' ? '-top-[6%]' : '-bottom-[4%]'
        )}
        style={{
          backgroundImage: lines,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: linesPosition === 'top' ? 'top' : 'bottom',
        }}
      />
      {children}
    </div>
  );
}

function LogoMazeCard() {
  return (
    <MazeTile
      variant="logo"
      bg="bg-[#fafaf7] border-2 border-white/60 dark:border-white/25 dark:bg-[#171d19]"
      lines={MAZE_LINES}
      linesPosition="bottom"
    />
  );
}

function PeachMazeCard() {
  return (
    <MazeTile
      variant="peach"
      bg="bg-warning-50 border border-white/80 dark:border-white dark:bg-[#72351F]"
      lines={MAZE_LINES}
      linesPosition="top"
    />
  );
}

function InfoCard({
  bg,
  lines,
  textClassName,
  children,
}: {
  bg: string;
  lines: string;
  textClassName: string;
  children: React.ReactNode;
}) {
  return (
    <MazeTile bg={bg} lines={lines} linesTone={lines === MAZE_LINES_BLUE ? 'blue' : 'green'} linesPosition="bottom">
      <p
        dir="rtl"
        className={cn(
          'relative z-10 text-center text-lg font-bold leading-8',
          textClassName,
          lalezar.className
        )}
      >
        <span key={String(children)} className="auth-card-text inline-block">
          {children}
        </span>
      </p>
    </MazeTile>
  );
}

function AnimatedCard({
  slot,
  children,
}: {
  slot: CardSlot;
  children: React.ReactNode;
}) {
  return (
    <div className="auth-card-slot pointer-events-none absolute" style={cardSlotStyle(slot)}>
      <div className="pointer-events-auto size-full">{children}</div>
    </div>
  );
}

function AuthCardGrid({ step }: { step: AuthCardStep }) {
  const aside = useTranslations('authAside');
  const slots = SLOTS[step];
  const isOtp = step === 'otp';

  return (
    <div
      className="auth-card-grid pointer-events-none absolute hidden lg:block"
      style={{
        left: FIGMA_CARD_GRID.x,
        top: FIGMA_CARD_GRID.y,
        width: FIGMA_CARD_GRID.width,
        height: FIGMA_CARD_GRID.height,
      }}
    >
      <AnimatedCard slot={slots['glass-1']}>
        <GlassCard />
      </AnimatedCard>

      <AnimatedCard slot={slots.logo}>
        <LogoMazeCard />
      </AnimatedCard>

      <AnimatedCard slot={slots.green}>
        <InfoCard
          bg="bg-primary-100 dark:bg-[#003825]/80"
          lines={MAZE_LINES}
          textClassName="text-primary-600 dark:text-primary-200"
        >
          {isOtp ? aside('otpCard1') : aside('card1')}
        </InfoCard>
      </AnimatedCard>

      <AnimatedCard slot={slots.blue}>
        <InfoCard
          bg="bg-info-100 dark:bg-[#073543]/80"
          lines={MAZE_LINES_BLUE}
          textClassName={
            isOtp ? 'text-info-700 dark:text-info-200' : 'text-green-700 dark:text-green-300'
          }
        >
          {isOtp ? aside('otpCard2') : aside('card2')}
        </InfoCard>
      </AnimatedCard>

      <AnimatedCard slot={slots.peach}>
        <PeachMazeCard />
      </AnimatedCard>

      <AnimatedCard slot={slots['glass-2']}>
        <GlassCard />
      </AnimatedCard>
    </div>
  );
}

function AuthLogo() {
  return (
    <Link
      href="/"
      className="relative z-10 mx-auto mb-10 block w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <Image
        src="/logo.svg"
        alt="دانشجوام"
        width={182}
        height={72}
        priority
        draggable={false}
        className="h-[64px] w-auto select-none "
      />
    </Link>
  );
}

function AuthPanelChrome({
  children,
  backHref,
  step,
  variant,
}: {
  children: React.ReactNode;
  backHref?: string;
  step: AuthCardStep;
  variant: 'desktop' | 'mobile';
}) {
  const t = useTranslations('auth');
  const isDesktop = variant === 'desktop';

  return (
    <div
      dir="rtl"
      className={cn(
        'relative flex flex-col overflow-hidden bg-auth-panel',
        isDesktop
          ? 'size-full rounded-r-[30px] px-[30px] py-6'
          : 'w-full max-w-[363px] min-h-[635px] rounded-[28px] px-6 py-10 shadow-auth-panel sm:px-10'
      )}
    >
      <FormPattern />

      <div
        className={cn(
          'relative z-10 flex items-center justify-between gap-3',
          isDesktop ? 'mb-4' : 'mb-2'
        )}
      >
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium dark:text-primary-100 text-primary-500 transition-colors hover:bg-primary-50 dark:hover:bg-primary-900/30"
          >
            <ChevronRight className="size-4" /> {t('back')}

          </Link>
        ) : null}
        <ThemeToggle />
      </div>

      <AuthLogo />

      <div
        key={step}
        className="auth-form-step relative z-10 mx-auto w-full mt-10"
        style={{ maxWidth: FIGMA_LOGIN_PANEL.formWidth }}
      >
        {children}
      </div>
    </div>
  );
}

export function AuthShell({ children, backHref, step = 'identifier' }: AuthShellProps) {
  const isLg = useIsLg();

  const panel = (
    <AuthPanelChrome backHref={backHref} step={step} variant={isLg ? 'desktop' : 'mobile'}>
      {children}
    </AuthPanelChrome>
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AuthPageBackground>
        <AuthCardGrid step={step} />

        {isLg ? (
          <div
            className="pointer-events-auto absolute"
            style={{
              left: FIGMA_LOGIN_PANEL.x,
              top: FIGMA_LOGIN_PANEL.y,
              width: FIGMA_LOGIN_PANEL.width,
              height: FIGMA_LOGIN_PANEL.height,
            }}
          >
            {panel}
          </div>
        ) : null}
      </AuthPageBackground>

      {!isLg ? (
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
          {panel}
        </div>
      ) : null}
    </div>
  );
}
