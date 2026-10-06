import { HomeBusinessesSection } from '@home/components/home-businesses-section';
import { HomeCategoriesSection } from '@home/components/home-categories-section';
import { HomeDiscountsSection } from '@home/components/home-discounts-section';
import { HomeHeroBanner } from '@home/components/home-hero-banner';
import { HomeIntroduction } from '@home/components/home-introduction';
import { HomePromoBanner } from '@home/components/home-promo-banner';

/** Figma Private panel #1:8903 — desktop 1512px, tablet 834px, mobile 390px. Motivation + footer live in the site layout. */
export function HomePage() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[1512px] px-4 pb-16 min-[834px]:px-12 min-[1512px]:px-[100px]">
      <div className="flex flex-col gap-12 pt-6 min-[834px]:pt-8">
        <HomeHeroBanner />
        <HomeIntroduction />
        <HomePromoBanner />
        <HomeCategoriesSection />
        <HomeDiscountsSection />
        <HomeBusinessesSection />
      </div>
    </div>
  );
}
