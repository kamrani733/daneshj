// MOCK ONLY — fake global search until a search endpoint exists. Imported by `@search/api` only.
import {
  CATEGORY_MENU_ITEMS,
  SERVICES_MENU_ITEMS,
  type HomeMenuItem,
} from '@/components/site/nav-data';
import { normalizeFaText } from '@/lib/normalize-fa';

import type {
  ProviderTypeId,
  SearchCategoryOption,
  SearchProductItem,
  SearchProviderItem,
  SearchRequest,
  SearchResults,
  SearchSectionId,
  SearchSectionResult,
  SearchServiceItem,
  SearchTrendingItem,
  SearchUserItem,
  UserTypeId,
} from '@search/types';
import { leafOptions } from '@search/utils/category-tree';
import { SEARCH_PREVIEW_SIZE } from '@search/utils/search-params';

/** Typing this query simulates a failed request (error state + retry). */
export const MOCK_SEARCH_ERROR_QUERY = 'خطای آزمایشی';

const LATENCY_MS = 350;
const PANEL_PHOTOS = '/images/public-panel/catalog';
const HOME_PHOTOS = '/images/home/photos';
const AVATAR = '/images/public-panel/avatar.png';

/** The service whose products use the discount category tree. */
export const DISCOUNT_SERVICE_ID = 'discount';

function wait<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

/**
 * Filter labels as drawn in the Figma filter frames where they differ from the home menu
 * (`nav-data.ts` stays as is; the search API is expected to send these).
 */
const DISCOUNT_LABELS: Record<string, string> = {
  cafe: 'کافه و رستوران',
  coffee: 'کافه',
  repair: 'تعمیرات و نگهداری',
  cleaning: 'نظافت',
  accessories: 'زیورآلات',
};

const SERVICE_LABELS: Record<string, string> = {
  transport: 'تسهیلات و تخفیف در سیستم های حمل و نقل',
  reward: 'پاداش',
  'free-courses': 'آموزش های آزاد - کرس های مستقل',
  elearning: 'یادگیری/آموزش های الکترونیکی از راه دور',
  startup: 'طرح ایده و جذب مشارکت کننده / سرمایه گذاری',
  military: 'طرح خدمات سربازی برای سازمان های غیر نظامی',
  'graduate-jobs': 'اشتغال تازه فارغ التحصیلان با حمایت های دولتی',
};

/** Figma sub-category order where it differs from the menu. */
const CHILD_ORDER: Record<string, string[]> = {
  books: ['book', 'stationery', 'audiobook'],
};

function toCategoryTree(
  items: HomeMenuItem[],
  labels: Record<string, string>,
): SearchCategoryOption[] {
  const convert = (item: HomeMenuItem): SearchCategoryOption => {
    const order = CHILD_ORDER[item.id] ?? [];
    const rank = (child: HomeMenuItem) =>
      order.includes(child.id) ? order.indexOf(child.id) : order.length;
    const children = item.children
      ? [...item.children].sort((a, b) => rank(a) - rank(b)).map(convert)
      : undefined;
    return {
      id: item.id,
      // nav-data mixes Arabic ي/ك and double spaces; the API is expected to send clean Persian.
      label: normalizeFaText(labels[item.id] ?? item.label),
      children,
    };
  };
  return items.map(convert);
}

/** Product categories of the discount service. */
export const DISCOUNT_CATEGORY_TREE: SearchCategoryOption[] = toCategoryTree(
  CATEGORY_MENU_ITEMS,
  DISCOUNT_LABELS,
);

/** «دسته بندی های اصلی و فرعی» of the services filter = the services menu tree. */
export const SERVICE_TREE: SearchCategoryOption[] = toCategoryTree(
  SERVICES_MENU_ITEMS,
  SERVICE_LABELS,
);
const SERVICE_LEAVES = leafOptions(SERVICE_TREE);

const serviceLabel = (id: string) =>
  SERVICE_LEAVES.find((option) => option.id === id)?.label ?? '';

/** Figma shows placeholder categories («دسته بندی یک» …) for services other than discounts. */
export function placeholderCategories(
  serviceId: string,
): SearchCategoryOption[] {
  const sub = (id: string): SearchCategoryOption[] => [
    { id: `${serviceId}-${id}-a`, label: 'زیر دسته یک' },
    { id: `${serviceId}-${id}-b`, label: 'زیر دسته دو' },
  ];
  return [
    { id: `${serviceId}-c1`, label: 'دسته بندی یک', children: sub('c1') },
    { id: `${serviceId}-c2`, label: 'دسته بندی دو', children: sub('c2') },
    { id: `${serviceId}-c3`, label: 'دسته بندی سه' },
    { id: `${serviceId}-c4`, label: 'دسته بندی چهار', children: sub('c4') },
  ];
}

type MockProduct = SearchProductItem & {
  serviceId: string;
  categoryId: string;
};

function product(
  id: string,
  title: string,
  categoryId: string,
  imageSrc: string,
  serviceId = DISCOUNT_SERVICE_ID,
): MockProduct {
  return {
    id,
    title,
    serviceId,
    serviceTitle: serviceLabel(serviceId),
    categoryId,
    imageSrc,
  };
}

const HAND_WRITTEN_PRODUCTS: MockProduct[] = [
  product(
    'p1',
    'لپ‌تاپ دانشجویی',
    'computer',
    `${PANEL_PHOTOS}/portfolio-shop.jpg`,
  ),
  product(
    'p2',
    'هدفون بی‌سیم',
    'mobile-accessories',
    `${PANEL_PHOTOS}/portfolio-poster.jpg`,
  ),
  product(
    'p3',
    'بسته اینترنت ماهانه',
    'internet',
    `${PANEL_PHOTOS}/news-university.jpg`,
  ),
  product(
    'p4',
    'دفتر و لوازم التحریر',
    'stationery',
    `${HOME_PHOTOS}/home-stationery.jpg`,
  ),
  product(
    'p5',
    'کتاب‌های درسی دست دوم',
    'book',
    `${HOME_PHOTOS}/home-books.jpg`,
  ),
  product(
    'p6',
    'اشتراک کتاب صوتی',
    'audiobook',
    `${HOME_PHOTOS}/home-bookstore.jpg`,
  ),
  product(
    'p7',
    'قهوه و کیک کافه کتاب',
    'coffee',
    `${HOME_PHOTOS}/biz-cafe.jpg`,
  ),
  product(
    'p8',
    'منوی ناهار دانشجویی',
    'restaurant',
    `${HOME_PHOTOS}/biz-open-sign.jpg`,
  ),
  product(
    'p9',
    'اسنک و نوشیدنی',
    'snack',
    `${HOME_PHOTOS}/biz-flower-cafe.jpg`,
  ),
  product('p10', 'عضویت باشگاه ورزشی', 'sport', `${HOME_PHOTOS}/biz-gym.jpg`),
  product(
    'p11',
    'کلاس نقاشی و طراحی',
    'art',
    `${PANEL_PHOTOS}/newsletter-1.jpg`,
  ),
  product('p12', 'لوازم آرایشی', 'cosmetics', `${PANEL_PHOTOS}/cosmetics.jpg`),
  product('p13', 'عینک طبی', 'glasses', `${PANEL_PHOTOS}/newsletter-2.jpg`),
  product(
    'p14',
    'تور یک‌روزه طبیعت‌گردی',
    'tour',
    `${PANEL_PHOTOS}/pool-loungers.jpg`,
  ),
  product('p15', 'رزرو هتل', 'hotel', `${PANEL_PHOTOS}/hotel-room.jpg`),
  product(
    'p16',
    'بلیت سینما و تئاتر',
    'media',
    `${PANEL_PHOTOS}/newsletter-3.jpg`,
  ),
  product(
    'p17',
    'پوشاک ورزشی',
    'sportswear',
    `${HOME_PHOTOS}/home-clothes.jpg`,
  ),
  product(
    'p18',
    'کیف و کفش',
    'bags-shoes',
    `${PANEL_PHOTOS}/portfolio-travel.jpg`,
  ),
  product(
    'p19',
    'گل و گیاه آپارتمانی',
    'plants',
    `${HOME_PHOTOS}/biz-plant-shop.jpg`,
  ),
  product(
    'p20',
    'وسایل دکوری خوابگاه',
    'decor',
    `${PANEL_PHOTOS}/newsletter-4.jpg`,
  ),
  product(
    'p21',
    'تعمیر لپ‌تاپ و موبایل',
    'digital-repair',
    `${PANEL_PHOTOS}/news-national.jpg`,
  ),
  product(
    'p22',
    'ترجمه مقاله',
    'translation',
    `${PANEL_PHOTOS}/news-international.jpg`,
  ),
  product(
    'p23',
    'آرایشگاه دانشجویی',
    'healthcare',
    `${HOME_PHOTOS}/biz-barber.jpg`,
  ),
  product(
    'p24',
    'دوره آموزش زبان',
    'training',
    `${HOME_PHOTOS}/hero-students-1.jpg`,
  ),
  product(
    'p25',
    'مشاوره تحصیلی',
    'consulting',
    `${HOME_PHOTOS}/hero-students-2.jpg`,
  ),
  product(
    'p26',
    'وام قرض‌الحسنه دانشجویی',
    'loan-c1-a',
    `${PANEL_PHOTOS}/book-stall.jpg`,
    'loan',
  ),
  product(
    'p27',
    'کارت هدیه خرید کتاب',
    'gift-card-c3',
    `${HOME_PHOTOS}/home-bookstore.jpg`,
    'gift-card',
  ),
  product(
    'p28',
    'دوره آنلاین برنامه‌نویسی',
    'virtual-c2-b',
    `${HOME_PHOTOS}/hero-students-1.jpg`,
    'virtual',
  ),
  // Trending queries («پرجستجوترین‌های هفته») lead to results.
  product(
    't1',
    'کمپین تخفیف یلدا؛ کتاب و لوازم التحریر',
    'book',
    `${HOME_PHOTOS}/home-bookstore.jpg`,
  ),
  product(
    't2',
    'فروش ویژه زمستانه پوشاک',
    'clothes',
    `${HOME_PHOTOS}/home-clothes.jpg`,
  ),
  product(
    't3',
    'کمپین فروش ویژه لپ‌تاپ',
    'computer',
    `${PANEL_PHOTOS}/portfolio-shop.jpg`,
  ),
  product(
    't4',
    'جشنواره کتاب دانشجویی',
    'book',
    `${HOME_PHOTOS}/home-books.jpg`,
  ),
];

const PHOTOS = [
  `${PANEL_PHOTOS}/portfolio-shop.jpg`,
  `${HOME_PHOTOS}/home-books.jpg`,
  `${PANEL_PHOTOS}/cosmetics.jpg`,
  `${HOME_PHOTOS}/biz-cafe.jpg`,
  `${PANEL_PHOTOS}/hotel-room.jpg`,
  `${HOME_PHOTOS}/home-clothes.jpg`,
  `${PANEL_PHOTOS}/newsletter-2.jpg`,
  `${HOME_PHOTOS}/biz-plant-shop.jpg`,
];

/** Label of a leaf with its parent, e.g. «دسته بندی یک / زیر دسته دو». */
function leafTitles(tree: SearchCategoryOption[]) {
  return tree.flatMap((main) =>
    main.children?.length
      ? main.children.map((sub) => ({
          id: sub.id,
          title: `${main.label} / ${sub.label}`,
        }))
      : [{ id: main.id, title: main.label }],
  );
}

/**
 * Every filter option returns at least one product: a generated product for each discount category
 * without a hand-written one, and one for each leaf of every other service's category tree.
 */
const GENERATED_PRODUCTS: MockProduct[] = (() => {
  const covered = new Set(HAND_WRITTEN_PRODUCTS.map((item) => item.categoryId));
  const discount = leafTitles(DISCOUNT_CATEGORY_TREE)
    .filter((leaf) => !covered.has(leaf.id))
    .map((leaf, index) =>
      product(
        `g-${leaf.id}`,
        `پیشنهاد ویژه ${leaf.title}`,
        leaf.id,
        PHOTOS[index % PHOTOS.length],
      ),
    );
  const others = SERVICE_LEAVES.filter(
    (service) => service.id !== DISCOUNT_SERVICE_ID,
  ).flatMap((service, serviceIndex) =>
    leafTitles(placeholderCategories(service.id))
      .filter((leaf) => !covered.has(leaf.id))
      .map((leaf, index) =>
        product(
          `g-${leaf.id}`,
          leaf.title,
          leaf.id,
          PHOTOS[(serviceIndex + index) % PHOTOS.length],
          service.id,
        ),
      ),
  );
  return [...discount, ...others];
})();

const PRODUCTS: MockProduct[] = [
  ...HAND_WRITTEN_PRODUCTS,
  ...GENERATED_PRODUCTS,
];

const SERVICES: SearchServiceItem[] = SERVICE_LEAVES.map((option) => ({
  id: option.id,
  title: option.label,
  imageSrc: `${PANEL_PHOTOS}/portfolio-shop.jpg`,
}));

type MockProvider = SearchProviderItem & { type: ProviderTypeId };

const PROVIDERS: MockProvider[] = [
  {
    id: 'b1',
    name: 'کافه کتاب دانشجو',
    type: 'individual',
    imageSrc: `${HOME_PHOTOS}/biz-cafe.jpg`,
  },
  {
    id: 'b2',
    name: 'باشگاه ورزشی پردیس',
    type: 'legal',
    imageSrc: `${HOME_PHOTOS}/biz-gym.jpg`,
  },
  {
    id: 'b3',
    name: 'گل‌فروشی بهار',
    type: 'individual',
    imageSrc: `${HOME_PHOTOS}/biz-plant-shop.jpg`,
  },
  {
    id: 'b4',
    name: 'آرایشگاه مردانه نوین',
    type: 'individual',
    imageSrc: `${HOME_PHOTOS}/biz-barber.jpg`,
  },
  {
    id: 'b5',
    name: 'شرکت کتاب‌آرا',
    type: 'legal',
    imageSrc: `${HOME_PHOTOS}/home-bookstore.jpg`,
  },
];

type MockUser = SearchUserItem & { type: UserTypeId };

const USER_ROWS: Array<[string, string, string, UserTypeId]> = [
  ['u1', 'سارا احمدی', 'sara.ahmadi', 'student'],
  ['u2', 'علی رضایی', 'ali.rezaei', 'regular'],
  ['u3', 'مریم کریمی', 'maryam.karimi', 'graduate'],
  ['u4', 'محمد حسینی', 'm.hosseini', 'student'],
  ['u5', 'زهرا موسوی', 'zahra.mousavi', 'student'],
  ['u6', 'رضا محمدی', 'reza.mohammadi', 'regular'],
  ['u7', 'فاطمه جعفری', 'f.jafari', 'graduate'],
  ['u8', 'امیر کاظمی', 'amir.kazemi', 'student'],
  ['u9', 'نگار صادقی', 'negar.sadeghi', 'regular'],
  ['u10', 'حسین نوری', 'hossein.nouri', 'student'],
  ['u11', 'الهام قاسمی', 'elham.ghasemi', 'graduate'],
  ['u12', 'مهدی شریفی', 'mahdi.sharifi', 'student'],
  ['u13', 'نرگس اکبری', 'narges.akbari', 'regular'],
  ['u14', 'سینا رحیمی', 'sina.rahimi', 'student'],
  ['u15', 'یاسمن طاهری', 'yasaman.taheri', 'graduate'],
  ['u16', 'کیان مرادی', 'kian.moradi', 'student'],
];

const USERS: MockUser[] = USER_ROWS.map(([id, fullName, username, type]) => ({
  id,
  fullName,
  username,
  type,
  avatarSrc: AVATAR,
}));

function matches(query: string, ...fields: string[]): boolean {
  if (!query) return true;
  return fields.some((field) => normalizeFaText(field).includes(query));
}

/** Empty selection = no filter. */
function inSelection<T extends string>(selected: T[], value: T): boolean {
  return selected.length === 0 || selected.includes(value);
}

function section<T>(
  items: T[],
  id: SearchSectionId,
  expand: SearchSectionId[],
): SearchSectionResult<T> {
  return {
    total: items.length,
    items: expand.includes(id) ? items : items.slice(0, SEARCH_PREVIEW_SIZE),
  };
}

/** The in-memory search itself (synchronous, so filters can be unit-tested). */
export function searchMockData(request: SearchRequest): SearchResults {
  const { q, expand } = request;

  const products = PRODUCTS.filter(
    (item) =>
      matches(q, item.title, item.serviceTitle) &&
      (!request.service || item.serviceId === request.service) &&
      inSelection(request.categories, item.categoryId),
  ).map(({ id, title, serviceTitle, imageSrc }) => ({
    id,
    title,
    serviceTitle,
    imageSrc,
  }));
  const services = SERVICES.filter(
    (item) =>
      matches(q, item.title) && inSelection(request.serviceCategories, item.id),
  );
  const providers = PROVIDERS.filter(
    (item) =>
      matches(q, item.name) && inSelection(request.providerTypes, item.type),
  ).map(({ id, name, imageSrc }) => ({ id, name, imageSrc }));
  const users = USERS.filter(
    (item) =>
      matches(q, item.fullName, item.username) &&
      inSelection(request.userTypes, item.type),
  ).map(({ id, fullName, username, avatarSrc }) => ({
    id,
    fullName,
    username,
    avatarSrc,
  }));

  return {
    total: products.length + services.length + providers.length + users.length,
    products: section(products, 'products', expand),
    services: section(services, 'services', expand),
    providers: section(providers, 'providers', expand),
    users: section(users, 'users', expand),
  };
}

export function mockSearchAll(request: SearchRequest): Promise<SearchResults> {
  if (request.q === normalizeFaText(MOCK_SEARCH_ERROR_QUERY)) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('mock search failure')), LATENCY_MS),
    );
  }
  return wait(searchMockData(request));
}

/** Services tree (main → sub). Leaves are the services the product filter picks from. */
export function mockGetServiceTree(): Promise<SearchCategoryOption[]> {
  return wait(SERVICE_TREE);
}

/** Discount → the discount category tree; any other service → Figma placeholder categories. */
export function mockGetCategoryOptions(
  serviceId: string,
): Promise<SearchCategoryOption[]> {
  return wait(
    serviceId === DISCOUNT_SERVICE_ID
      ? DISCOUNT_CATEGORY_TREE
      : placeholderCategories(serviceId),
  );
}

const TRENDING: SearchTrendingItem[] = [
  { query: 'کمپین تخفیف یلدا', count: 140 },
  { query: 'فروش ویژه زمستانه', count: 40 },
  { query: 'کمپین فروش ویژه', count: 140 },
  { query: 'جشنواره کتاب دانشجویی', count: 90 },
];

export function mockGetTrendingSearches(): Promise<SearchTrendingItem[]> {
  return wait(TRENDING);
}
