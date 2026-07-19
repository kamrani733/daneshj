import { HOME_IMAGES } from '../home-assets';

import type { SearchFilterValues, SearchSortId } from './search-filter-data';

export type SearchResultItem = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  category: string;
  imageSrc: string;
  /** 0–100 for mock filtering / sorting */
  discountPercent: number;
  price: number;
  rating: number;
  popularity: number;
  /** ISO date string */
  createdAt: string;
};

export type SearchQuery = {
  query: string;
  category: string | null;
};

/** Mock search results — replace with API response later. */
export const MOCK_SEARCH_RESULTS: SearchResultItem[] = [
  {
    id: 'sr-1',
    title: 'تخفیف کتاب دانشگاهی',
    subtitle: 'کتاب‌فروشی دانشجو',
    badge: '۳۰٪',
    category: 'کتاب و لوازم التحریر',
    imageSrc: HOME_IMAGES.discountCard,
    discountPercent: 30,
    price: 180_000,
    rating: 4.5,
    popularity: 120,
    createdAt: '2026-07-10',
  },
  {
    id: 'sr-2',
    title: 'کافه دانشجویی ویژه',
    subtitle: 'کافه پردیس',
    badge: '۲۰٪',
    category: 'رستوران و کافی شاپ',
    imageSrc: HOME_IMAGES.discountCard,
    discountPercent: 20,
    price: 95_000,
    rating: 4.2,
    popularity: 210,
    createdAt: '2026-07-15',
  },
  {
    id: 'sr-3',
    title: 'دوره آموزش برنامه‌نویسی',
    subtitle: 'آکادمی مهارت',
    badge: '۴۰٪',
    category: 'آموزش و مشاوره ',
    imageSrc: HOME_IMAGES.discountCard,
    discountPercent: 40,
    price: 1_200_000,
    rating: 4.8,
    popularity: 340,
    createdAt: '2026-07-01',
  },
  {
    id: 'sr-4',
    title: 'لوازم ورزشی دانشجویان',
    subtitle: 'فروشگاه اسپورت',
    badge: '۱۵٪',
    category: 'هنر و ورزش',
    imageSrc: HOME_IMAGES.discountCard,
    discountPercent: 15,
    price: 450_000,
    rating: 3.9,
    popularity: 80,
    createdAt: '2026-06-20',
  },
  {
    id: 'sr-5',
    title: 'بیمه تکمیلی دانشجویی',
    subtitle: 'بیمه دانشجوام',
    category: 'سلامت و زیبایی',
    imageSrc: HOME_IMAGES.discountCard,
    discountPercent: 10,
    price: 2_500_000,
    rating: 4.1,
    popularity: 60,
    createdAt: '2026-05-12',
  },
  {
    id: 'sr-6',
    title: 'فضای کار اشتراکی',
    subtitle: 'هاب استارتاپ',
    badge: '۲۵٪',
    category: 'ایجاد کسب و کار ',
    imageSrc: HOME_IMAGES.discountCard,
    discountPercent: 25,
    price: 800_000,
    rating: 4.6,
    popularity: 150,
    createdAt: '2026-07-18',
  },
  {
    id: 'sr-7',
    title: 'تخفیف اینترنت دانشجویی',
    subtitle: 'اپراتور داده',
    badge: '۱۰٪',
    category: 'تکنولوژی',
    imageSrc: HOME_IMAGES.discountCard,
    discountPercent: 10,
    price: 320_000,
    rating: 3.7,
    popularity: 190,
    createdAt: '2026-07-08',
  },
  {
    id: 'sr-8',
    title: 'پوشاک دانشجویی',
    subtitle: 'برند دانشجو',
    badge: '۳۵٪',
    category: 'پوشاک و مد',
    imageSrc: HOME_IMAGES.discountCard,
    discountPercent: 35,
    price: 560_000,
    rating: 4.4,
    popularity: 275,
    createdAt: '2026-07-17',
  },
  {
    id: 'sr-9',
    title: 'تعمیر لپ‌تاپ دانشجویی',
    subtitle: 'مرکز خدمات دیجیتال',
    badge: '۲۰٪',
    category: 'تعمیرات و خدمات',
    imageSrc: HOME_IMAGES.discountCard,
    discountPercent: 20,
    price: 150_000,
    rating: 4.0,
    popularity: 95,
    createdAt: '2026-06-28',
  },
  {
    id: 'sr-10',
    title: 'لوازم دکوراسیون خوابگاه',
    subtitle: 'خانه دانشجو',
    badge: '۱۵٪',
    category: 'خانه و دکوراسیون',
    imageSrc: HOME_IMAGES.discountCard,
    discountPercent: 15,
    price: 220_000,
    rating: 3.8,
    popularity: 70,
    createdAt: '2026-07-12',
  },
];

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

/** Client-side mock filter — swap for API call later. */
export function filterMockSearchResults({
  query,
  category,
}: SearchQuery): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  const cat = category?.trim() ?? '';

  return MOCK_SEARCH_RESULTS.filter((item) => {
    const itemCat = item.category.trim();
    const matchesCategory =
      !cat ||
      itemCat === cat.trim() ||
      itemCat.includes(cat.trim()) ||
      cat.trim().includes(itemCat);
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      itemCat.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

/** Apply filter-bar fields + sort on already text-matched results. */
export function applySearchFilters(
  items: SearchResultItem[],
  filters: SearchFilterValues,
  sort: SearchSortId
): SearchResultItem[] {
  const q = filters.query.trim().toLowerCase();
  const discountMin = parseOptionalNumber(filters.discountMin);
  const discountMax = parseOptionalNumber(filters.discountMax);
  const priceMin = parseOptionalNumber(filters.priceMin);
  const priceMax = parseOptionalNumber(filters.priceMax);
  const ratingMin = parseOptionalNumber(filters.ratingMin);
  const dateFrom = filters.dateFrom.trim();
  const dateTo = filters.dateTo.trim();

  const filtered = items.filter((item) => {
    if (
      q &&
      !item.title.toLowerCase().includes(q) &&
      !item.subtitle.toLowerCase().includes(q) &&
      !item.category.toLowerCase().includes(q)
    ) {
      return false;
    }
    if (discountMin !== null && item.discountPercent < discountMin) return false;
    if (discountMax !== null && item.discountPercent > discountMax) return false;
    if (priceMin !== null && item.price < priceMin) return false;
    if (priceMax !== null && item.price > priceMax) return false;
    if (ratingMin !== null && item.rating < ratingMin) return false;
    if (dateFrom && item.createdAt < dateFrom) return false;
    if (dateTo && item.createdAt > dateTo) return false;
    return true;
  });

  const sorted = [...filtered];
  sorted.sort((a, b) => {
    if (sort === 'mostDiscount') return b.discountPercent - a.discountPercent;
    if (sort === 'popular') return b.popularity - a.popularity;
    if (sort === 'priceHigh') return b.price - a.price;
    if (sort === 'priceLow') return a.price - b.price;
    return b.createdAt.localeCompare(a.createdAt);
  });
  return sorted;
}
