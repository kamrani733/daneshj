import dynamic from 'next/dynamic';
import { getSession } from '@daneshjoam/auth';

import { SessionKeepAlive } from '@/components/session-keep-alive';

import { HomeBgPattern } from './components/home-bg-pattern';
import { HomeBusinessesSection } from './components/home-businesses-section';
import { HomeCategoriesSection } from './components/home-categories-section';
import { HomeDiscountsSection } from './components/home-discounts-section';
import { HomeHeader } from './components/home-header';
import { HomeHeroBanner } from './components/home-hero-banner';
import { HomeIntroduction } from './components/home-introduction';
import { HomePromoBanner } from './components/home-promo-banner';
import { HomeSearchShell } from './components/home-search-shell';

const HomeMotivationBox = dynamic(
  () => import('./components/home-motivation-box').then((mod) => mod.HomeMotivationBox)
);

const HomeFooter = dynamic(() => import('./components/home-footer').then((mod) => mod.HomeFooter));

/** Figma Private panel #1:8903 — desktop 1512px, tablet 834px, mobile 390px. */
export async function HomePage() {
  const session = await getSession();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-home-scene" dir="rtl">
      <SessionKeepAlive enabled={!!session?.refreshToken && !!session.sessionKey} />
      <HomeHeader
        isAuthenticated={!!session}
        userName={session?.user.name?.trim() || undefined}
        accessToken={session?.accessToken}
      />
      <HomeBgPattern />
      <HomeSearchShell
        motivation={<HomeMotivationBox />}
        footer={<HomeFooter />}
      >
        <HomeHeroBanner />
        <HomeIntroduction />
        <HomePromoBanner />
        <HomeCategoriesSection />
        <HomeDiscountsSection />
        <HomeBusinessesSection />
      </HomeSearchShell>
    </div>
  );
}
