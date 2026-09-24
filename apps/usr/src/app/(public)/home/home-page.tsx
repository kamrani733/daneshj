import { HomeBusinessesSection } from '@home/components/home-businesses-section';
import { HomeCategoriesSection } from '@home/components/home-categories-section';
import { HomeDiscountsSection } from '@home/components/home-discounts-section';
import { HomeHeroBanner } from '@home/components/home-hero-banner';
import { HomeIntroduction } from '@home/components/home-introduction';
import { HomePromoBanner } from '@home/components/home-promo-banner';
import { HomeSearchShell } from '@home/components/home-search-shell';

/** Figma Private panel #1:8903 — desktop 1512px, tablet 834px, mobile 390px. */
export function HomePage() {
  return (
    <HomeSearchShell>
      <HomeHeroBanner />
      <HomeIntroduction />
      <HomePromoBanner />
      <HomeCategoriesSection />
      <HomeDiscountsSection />
      <HomeBusinessesSection />
    </HomeSearchShell>
  );
}
