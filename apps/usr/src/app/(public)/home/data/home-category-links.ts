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
    iconSrc: '/images/home/categories/business.png',
  },
  {
    id: 'education',
    labelKey: 'education',
    href: '/categories/education',
    iconSrc: '/images/home/categories/education.png',
  },
  {
    id: 'tech',
    labelKey: 'tech',
    href: '/categories/tech',
    iconSrc: '/images/home/categories/tech.png',
  },
  {
    id: 'book',
    labelKey: 'book',
    href: '/categories/book',
    iconSrc: '/images/home/categories/book.png',
  },
  {
    id: 'art',
    labelKey: 'art',
    href: '/categories/art',
    iconSrc: '/images/home/categories/art.png',
  },
  {
    id: 'beauty',
    labelKey: 'beauty',
    href: '/categories/beauty',
    iconSrc: '/images/home/categories/beauty.png',
  },
  {
    id: 'game',
    labelKey: 'game',
    href: '/categories/game',
    iconSrc: '/images/home/categories/game.png',
  },
  {
    id: 'fashion',
    labelKey: 'fashion',
    href: '/categories/fashion',
    iconSrc: '/images/home/categories/fashion.png',
  },
  {
    id: 'cafe',
    labelKey: 'cafe',
    href: '/categories/cafe',
    iconSrc: '/images/home/categories/cafe.png',
  },
  {
    id: 'finance',
    labelKey: 'finance',
    href: '/categories/finance',
    iconSrc: '/images/home/categories/finance.png',
  },
  {
    id: 'decor',
    labelKey: 'decor',
    href: '/categories/decor',
    iconSrc: '/images/home/categories/decor.png',
  },
  {
    id: 'repair',
    labelKey: 'repair',
    href: '/categories/repair',
    iconSrc: '/images/home/categories/repair.png',
  },
  {
    id: 'other',
    labelKey: 'other',
    href: '/categories/other',
    iconSrc: '/images/home/categories/other.png',
  },
];
