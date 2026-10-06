/**
 * Global search (/search) — provisional DTOs. No search endpoint exists yet
 * (`docs/09-known-issues.md`); the shapes follow the Figma result sections.
 */

export const SEARCH_SECTION_IDS = [
  'products',
  'services',
  'providers',
  'users',
] as const;

export type SearchSectionId = (typeof SEARCH_SECTION_IDS)[number];

/** Provider legal type (Figma «سرویس دهنده» filter). */
export const PROVIDER_TYPE_IDS = ['individual', 'legal'] as const;
export type ProviderTypeId = (typeof PROVIDER_TYPE_IDS)[number];

export function isProviderTypeId(id: string): id is ProviderTypeId {
  return (PROVIDER_TYPE_IDS as readonly string[]).includes(id);
}

/** User membership type (Figma «کاربران» filter). */
export const USER_TYPE_IDS = ['regular', 'student', 'graduate'] as const;
export type UserTypeId = (typeof USER_TYPE_IDS)[number];

export function isUserTypeId(id: string): id is UserTypeId {
  return (USER_TYPE_IDS as readonly string[]).includes(id);
}

/** Applied filters of every result section. */
export type SearchFilterState = {
  /** محصولات — selected service id. */
  service: string | null;
  /** محصولات — selected leaf category ids of that service. */
  categories: string[];
  /** سرویس‌ها — selected leaf ids of the service tree («دسته بندی های اصلی و فرعی»). */
  serviceCategories: string[];
  /** سرویس دهنده‌ها — حقیقی / حقوقی. */
  providerTypes: ProviderTypeId[];
  /** کاربران — membership types. */
  userTypes: UserTypeId[];
};

/** Search state that lives in the URL query string. */
export type SearchUrlState = SearchFilterState & {
  /** Normalized query, ≤ 50 characters. */
  q: string;
  /** Sections showing every result instead of the preview. */
  expand: SearchSectionId[];
};

export type SearchProductFilter = Pick<
  SearchFilterState,
  'service' | 'categories'
>;

export type SearchRequest = SearchUrlState;

export type SearchProductItem = {
  id: string;
  title: string;
  serviceTitle: string;
  imageSrc: string;
};

export type SearchServiceItem = {
  id: string;
  title: string;
  imageSrc: string;
};

export type SearchProviderItem = {
  id: string;
  name: string;
  imageSrc: string;
};

export type SearchUserItem = {
  id: string;
  fullName: string;
  username: string;
  avatarSrc: string;
};

export type SearchSectionResult<T> = {
  /** Matches for this section (all pages). */
  total: number;
  /** Preview or full list, depending on `expand`. */
  items: T[];
};

export type SearchResults = {
  total: number;
  products: SearchSectionResult<SearchProductItem>;
  services: SearchSectionResult<SearchServiceItem>;
  providers: SearchSectionResult<SearchProviderItem>;
  users: SearchSectionResult<SearchUserItem>;
};

export type SearchCategoryOption = {
  id: string;
  label: string;
  children?: SearchCategoryOption[];
};

/** «پرجستجوترین‌های هفته» entry. */
export type SearchTrendingItem = {
  query: string;
  /** Searches this week. */
  count: number;
};
