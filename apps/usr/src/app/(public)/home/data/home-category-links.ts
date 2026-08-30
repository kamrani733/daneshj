export type HomeCategoryLink = {
  id: string;
  labelKey: string;
  href: string;
  iconSrc: string;
};

/** Figma Category #53:532 — 7×2 icon links before discounts. */
export const HOME_CATEGORY_LINKS: HomeCategoryLink[] = [
  {
    id: 'business',
    labelKey: 'business',
    href: '/categories/business',
    iconSrc: '/images/placeholders/categories/business.png',
  },
  {
    id: 'education',
    labelKey: 'education',
    href: '/categories/education',
    iconSrc: '/images/placeholders/categories/education.png',
  },
  {
    id: 'tech',
    labelKey: 'tech',
    href: '/categories/tech',
    iconSrc: '/images/placeholders/categories/tech.png',
  },
  {
    id: 'book',
    labelKey: 'book',
    href: '/categories/book',
    iconSrc: '/images/placeholders/categories/book.png',
  },
  {
    id: 'art',
    labelKey: 'art',
    href: '/categories/art',
    iconSrc: '/images/placeholders/categories/art.png',
  },
  {
    id: 'beauty',
    labelKey: 'beauty',
    href: '/categories/beauty',
    iconSrc: '/images/placeholders/categories/beauty.png',
  },
  {
    id: 'game',
    labelKey: 'game',
    href: '/categories/game',
    iconSrc: '/images/placeholders/categories/game.png',
  },
  {
    id: 'fashion',
    labelKey: 'fashion',
    href: '/categories/fashion',
    iconSrc: '/images/placeholders/categories/fashion.png',
  },
  {
    id: 'cafe',
    labelKey: 'cafe',
    href: '/categories/cafe',
    iconSrc: '/images/placeholders/categories/cafe.png',
  },
  {
    id: 'finance',
    labelKey: 'finance',
    href: '/categories/finance',
    iconSrc: '/images/placeholders/categories/finance.png',
  },
  {
    id: 'decor',
    labelKey: 'decor',
    href: '/categories/decor',
    iconSrc: '/images/placeholders/categories/decor.png',
  },
  {
    id: 'repair',
    labelKey: 'repair',
    href: '/categories/repair',
    iconSrc: '/images/placeholders/categories/repair.png',
  },
  {
    id: 'other',
    labelKey: 'other',
    href: '/categories/other',
    iconSrc: '/images/placeholders/categories/other.png',
  },
];
