export type HomeMenuItem = {
  id: string;
  label: string;
  href?: string;
  children?: HomeMenuItem[];
};

export type HomeCategoryGridItem = {
  id: string;
  label: string;
  href?: string;
};

/** Figma Menu #1:8794 — category list (desktop dropdown / mobile list). */
export const CATEGORY_MENU_ITEMS: HomeMenuItem[] = [
  {
    id: 'business',
    label: 'ایجاد کسب و کار ',
    children: [
      { id: 'coworking', label: 'فضای کار اشتراکی ' },
      { id: 'tools', label: 'ابزار' },
      { id: 'office', label: 'لوازم اداری' },
    ],
  },
  {
    id: 'education',
    label: 'آموزش و مشاوره ',
    children: [
      { id: 'training', label: 'آموزش' },
      { id: 'consulting', label: 'مشاوره' },
    ],
  },
  {
    id: 'tech',
    label: 'تکنولوژی',
    children: [
      { id: 'computer', label: 'تجهیزات رایانه ای' },
      { id: 'mobile-accessories', label: 'لوازم جانبی موبایل' },
      { id: 'internet', label: 'اینترنت و سرویس های دیتا' },
    ],
  },
  {
    id: 'books',
    label: 'کتاب و لوازم التحریر',
    children: [
      { id: 'stationery', label: 'لوازم التحریر' },
      { id: 'book', label: 'کتاب ' },
      { id: 'audiobook', label: 'کتاب صوتی' },
    ],
  },
  {
    id: 'art-sport',
    label: 'هنر و ورزش',
    children: [
      { id: 'art', label: 'هنر' },
      { id: 'sport', label: 'ورزش' },
    ],
  },
  {
    id: 'health',
    label: 'سلامت و زیبایی',
    children: [
      { id: 'cosmetics', label: 'لوازم آرایشی' },
      { id: 'healthcare', label: 'سلامت و بهداشت' },
      { id: 'medical', label: 'خدمات درمانی' },
      { id: 'glasses', label: 'عینک طبی ' },
      { id: 'insurance-health', label: 'بیمه' },
    ],
  },
  {
    id: 'entertainment',
    label: 'سرگرمی و تفریح ',
    children: [
      { id: 'tourism', label: 'گردش و تفریح ' },
      { id: 'games', label: 'سرگرمی و بازی' },
      { id: 'party', label: 'جشن و مهمانی' },
      { id: 'media', label: 'فیلم و تیاتر و موسیقی ' },
      { id: 'travel', label: 'سفر و اقامت ' },
      { id: 'tour', label: 'سفر و تور' },
      { id: 'hotel', label: 'هتل' },
    ],
  },
  { id: 'fashion', label: 'پوشاک و مد' },
  { id: 'cafe', label: 'رستوران و کافی شاپ' },
  { id: 'finance', label: 'مالی' },
  { id: 'home', label: 'خانه و دکوراسیون' },
  { id: 'repair', label: 'تعمیرات و خدمات' },
  { id: 'other', label: 'سایر' },
];

/** Figma Category grid #1:9227 — 7×2 overlay tiles. */
export const CATEGORY_GRID_ITEMS: HomeCategoryGridItem[] = [
  { id: 'game', label: 'بازی و سرگرمی' },
  { id: 'beauty', label: 'بهداشت و زیبایی' },
  { id: 'art', label: 'ورزش و هنر' },
  { id: 'book', label: 'کتاب و لوازم التحریر' },
  { id: 'tech', label: 'تکنولوژی ' },
  { id: 'education', label: 'آموزش و مشاوره' },
  { id: 'business', label: 'ایجاد کسب و کار ' },
  { id: 'other', label: 'سایر' },
  { id: 'repair', label: 'تعمیرات ' },
  { id: 'decor', label: 'خانه و دکوراسیون' },
  { id: 'finance', label: 'مالی' },
  { id: 'cafe', label: 'کافه و رستوران' },
  { id: 'fashion', label: 'پوشاک ومد' },
];

/** Figma Menu #1:10403 — سرویس‌ها with nested flyouts. */
export const SERVICES_MENU_ITEMS: HomeMenuItem[] = [
  {
    id: 'welfare',
    label: 'رفاهی',
    children: [
      { id: 'housing', label: 'رفاه- اسکان دانشجویی' },
      { id: 'welfare-other', label: 'سایر خدمات رفاهی' },
    ],
  },
  {
    id: 'financial',
    label: 'مالی',
    children: [
      { id: 'transport', label: 'تسهیلات و تخفیف  در سیستم های حمل و انتقال' },
      { id: 'loan', label: 'وام دانشجویی' },
      { id: 'reward', label: 'پاداش (کسب امتیاز و تبدیل به پول یا افزودن به کیف پول)' },
      { id: 'cashback', label: 'بازگشت پول از خرید' },
      { id: 'discount', label: 'تخفبف کالا و خدمات' },
      { id: 'gift-card', label: 'کارت های هدیه' },
      { id: 'referral', label: 'سیستم معرفی به دوستان' },
      { id: 'direct-buy', label: ' خرید مستقیم' },
      { id: 'finance-other', label: 'سایر خدمات مالی' },
    ],
  },
  {
    id: 'insurance',
    label: 'بیمه',
    children: [
      {
        id: 'student-insurance',
        label: 'بیمه درمانی دانشجویان ( شامل بیمه تکمیلی درمان)',
      },
    ],
  },
  {
    id: 'education',
    label: 'آموزش',
    children: [
      { id: 'courses', label: 'معرفی دوره های تحصیلی دانشگاهی' },
      { id: 'free-courses', label: 'آموزش های آزاد- کرس های مستقل' },
      { id: 'virtual', label: 'دوره های دانشگاهی مجازی' },
      { id: 'elearning', label: 'يادگيري/ آموزش های الكترونيكی از راه دور' },
      { id: 'content', label: 'محتواهاي آموزشی' },
    ],
  },
  {
    id: 'social',
    label: 'اطلاع رسانی و اجتماعی',
    children: [
      { id: 'news', label: 'اخبار' },
      { id: 'newsletter', label: 'خبر نامه' },
      { id: 'events-abroad', label: 'اطلاع رسانی رخدادهای برون مرزی' },
      { id: 'research', label: 'اطلاع رسانی امور پژوهشی دانشگاه' },
      { id: 'calendar', label: ' رخدادهای تقویمی' },
      { id: 'hangouts', label: ' پاتوق ها' },
    ],
  },
  {
    id: 'industry',
    label: 'صنعت و دانشگاه',
    children: [
      { id: 'showcase', label: 'معرفی و ارایه کار دانشجویی' },
      { id: 'thesis', label: 'پایان نامه های تحصیلی در صنایع' },
      { id: 'tours', label: 'تورهای بازدید از صنایع و شرکت ها' },
      { id: 'internship', label: 'کاراموزی- کارورزی' },
      { id: 'careers-intro', label: 'معرفی مشاغل و آینده کار' },
    ],
  },
  {
    id: 'employment',
    label: 'اشتغال',
    children: [
      { id: 'student-jobs', label: 'شغل برای دانشجویان' },
      { id: 'gap-year', label: 'فراغت میان دوره از تحصیل برای کار' },
      { id: 'startup', label: 'طرح ایده کار و جذب مشارکت کننده/ سرمایه گذاری' },
      { id: 'military', label: 'طرح خدمت سربازی برای سازمان های غیر نظامی' },
      { id: 'graduate-jobs', label: 'اشتغال تازه فارغ التحصیلان- با حمایت های دولتی' },
    ],
  },
];

/** Figma cooperation / business partner items. */
export const COOPERATION_MENU_ITEMS: HomeMenuItem[] = [
  { id: 'coworking', label: 'فضای کار اشتراکی ' },
  { id: 'tools', label: 'ابزار' },
  { id: 'office', label: 'لوازم اداری' },
];

/** Figma Menu #1:10411 — ارتباط با ما. */
export const CONTACT_MENU_ITEMS: HomeMenuItem[] = [
  { id: 'support', label: 'پشتیبانی' },
  { id: 'contact-us', label: 'تماس با ما ' },
];

export const NAV_MENUS = {
  services: SERVICES_MENU_ITEMS,
  cooperation: COOPERATION_MENU_ITEMS,
  contact: CONTACT_MENU_ITEMS,
} as const;
