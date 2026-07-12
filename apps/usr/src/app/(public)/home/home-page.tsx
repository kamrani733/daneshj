import dynamic from 'next/dynamic';

import { HomeBgPattern } from './components/home-bg-pattern';
import { HomeBusinessesSection } from './components/home-businesses-section';
import { HomeDiscountsSection } from './components/home-discounts-section';
import { HomeHeader, HomeSearchCategoryBar } from './components/home-header';
import { HomeHeroBanner } from './components/home-hero-banner';
import { HomeIntroduction } from './components/home-introduction';
import { HomePromoBanner } from './components/home-promo-banner';

const HomeMotivationBox = dynamic(
  () => import('./components/home-motivation-box').then((mod) => mod.HomeMotivationBox)
);

const HomeFooter = dynamic(() => import('./components/home-footer').then((mod) => mod.HomeFooter));

/** Figma Private panel #1:8903 — desktop 1512px, tablet 834px, mobile 390px. */
export function HomePage() {
  return (
    <div className="relative min-h-screen bg-home-scene">
      <HomeHeader />
      <HomeBgPattern />

      <div className="relative z-10 mx-auto w-full max-w-[1512px] px-4 pb-16 min-[834px]:px-8 min-[1512px]:px-[100px]">
        <div className="flex flex-col gap-12 pt-6 min-[834px]:gap-12 min-[834px]:pt-8">
          <HomeSearchCategoryBar />

          <HomeHeroBanner />

          <HomeIntroduction />

          <HomePromoBanner />

          <HomeDiscountsSection />

          <HomeBusinessesSection />
        </div>
      </div>

      <div className="relative z-10 mt-16 flex flex-col">
        <HomeMotivationBox />
        <HomeFooter />
      </div>
    </div>
  );
}
