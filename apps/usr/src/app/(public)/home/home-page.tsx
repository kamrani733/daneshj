import { HomeBusinessesSection } from './components/home-businesses-section';
import { HomeCategoriesSection } from './components/home-categories-section';
import { HomeDiscountsSection } from './components/home-discounts-section';
import { HomeHeroBanner } from './components/home-hero-banner';
import { HomeIntroduction } from './components/home-introduction';
import { HomePromoBanner } from './components/home-promo-banner';
import { HomeSearchShell } from './components/home-search-shell';

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
