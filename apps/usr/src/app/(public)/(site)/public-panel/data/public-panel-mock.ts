/** Mock public panel owner — Figma content frame until API exists. */

export type SocialNetwork =
  | 'email'
  | 'telegram'
  | 'instagram'
  | 'x'
  | 'whatsapp'
  | 'linkedin'
  | 'website';

export type PublicPanelSocialLink = {
  network: SocialNetwork;
  href: string;
};

export type AcademicRecord = {
  id: string;
  degree: string;
  field: string;
  university: string;
  years: string;
};

export type DiscountOffer = {
  id: string;
  title: string;
  businessName: string;
  imageSrc: string;
  postedAgo: string;
  rating: number;
  reviewCount: number;
  originalPrice: string;
  finalPrice: string;
  discountBadge: string;
};

export type NewsItem = {
  id: string;
  title: string;
  imageSrc: string;
  viewCount: number;
  scopeLabel: string;
  publisherType: string;
  publishedAt: string;
  mainCategory: string;
  subCategory: string;
  summary: string;
  eventRange: string;
};

export type NewsletterItem = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  publisherName: string;
  publisherInitial: string;
  publishedAt: string;
  rating: number;
  reviewCount: number;
};

export type ServiceCatalog = {
  /** Totals for section/tab badges (may exceed preview list length). */
  totals: {
    discounts: number;
    news: number;
    newsletters: number;
  };
  discounts: DiscountOffer[];
  news: NewsItem[];
  newsletters: NewsletterItem[];
};

export type CommentKind = 'transferred' | 'registered';

export type CommentSort = 'newest' | 'oldest' | 'mostLiked';

export type PanelComment = {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  body: string;
  createdAt: string;
  kind: CommentKind;
  featured?: boolean;
  likes: number;
  dislikes: number;
  shares: number;
  replyToName?: string;
  replies?: PanelComment[];
};

export type PublicPanelProfile = {
  displayName: string;
  username: string;
  roleLabelKey: 'student';
  providerBadgeKey: 'individualProvider';
  location: string;
  bio: string;
  avatarSrc: string;
  electronicCardHref: string;
  socialLinks: PublicPanelSocialLink[];
  serviceSocialLinks: PublicPanelSocialLink[];
  stats: {
    followers: number;
    following: number;
    likers: number;
    liked: number;
  };
  engagement: {
    thumbsUp: number;
    thumbsDown: number;
    shares: number;
  };
  academicRecords: AcademicRecord[];
  serviceCatalog: ServiceCatalog;
  otherInfo: string[];
  comments: PanelComment[];
};

export const PUBLIC_PANEL_PATH = '/public-panel';
export const COMMENT_MAX_LENGTH = 1000;

export const MOCK_PUBLIC_PANEL: PublicPanelProfile = {
  displayName: 'سعید سعیدی راد',
  username: 'saeedusername',
  roleLabelKey: 'student',
  providerBadgeKey: 'individualProvider',
  location: 'تهران، دماوند، بخش یا روستا',
  bio: 'دانشجوی کارشناسی ارشد مهندسی نرم‌افزار هستم و به یادگیری مستمر، توسعه مهارت‌های حرفه‌ای و همکاری در پروژه‌های آموزشی علاقه دارم. هدفم ساختن تجربه‌های کاربری بهتر برای جامعه دانشجویی است.',
  avatarSrc: '/public-panel/avatar.png',
  electronicCardHref: '#',
  socialLinks: [
    { network: 'email', href: 'mailto:saeed@example.com' },
    { network: 'telegram', href: 'https://t.me/saeedusername' },
    { network: 'instagram', href: 'https://instagram.com/saeedusername' },
    { network: 'x', href: 'https://x.com/saeedusername' },
    { network: 'whatsapp', href: 'https://wa.me/989121234567' },
    { network: 'linkedin', href: 'https://linkedin.com/in/saeedusername' },
  ],
  serviceSocialLinks: [
    { network: 'email', href: 'mailto:saeed@example.com' },
    { network: 'telegram', href: 'https://t.me/saeedusername' },
    { network: 'instagram', href: 'https://instagram.com/saeedusername' },
    { network: 'x', href: 'https://x.com/saeedusername' },
    { network: 'whatsapp', href: 'https://wa.me/989121234567' },
    { network: 'linkedin', href: 'https://linkedin.com/in/saeedusername' },
    { network: 'website', href: 'https://example.com' },
  ],
  stats: {
    followers: 69,
    following: 12,
    likers: 45,
    liked: 32,
  },
  engagement: {
    thumbsUp: 15,
    thumbsDown: 15,
    shares: 15,
  },
  academicRecords: [
    {
      id: '1',
      degree: 'کارشناسی ارشد',
      field: 'مهندسی نرم‌افزار',
      university: 'دانشگاه تهران',
      years: '۱۴۰۱ — ۱۴۰۳',
    },
    {
      id: '2',
      degree: 'کارشناسی',
      field: 'مهندسی کامپیوتر',
      university: 'دانشگاه صنعتی شریف',
      years: '۱۳۹۷ — ۱۴۰۱',
    },
    {
      id: '3',
      degree: 'دیپلم',
      field: 'ریاضی فیزیک',
      university: 'دبیرستان نمونه دولتی',
      years: '۱۳۹۳ — ۱۳۹۷',
    },
  ],
  serviceCatalog: {
    totals: {
      discounts: 6,
      news: 3,
      newsletters: 3,
    },
    discounts: [
      {
        id: 'd1',
        title: 'عنوان تخفیف',
        businessName: 'عنوان کسب و کار ارایه دهنده تخفیف',
        imageSrc: '/public-panel/catalog/discount-1.png',
        postedAgo: '۲ ساعت پیش',
        rating: 4,
        reviewCount: 132,
        originalPrice: '۴۰۰,۰۰۰ تومان',
        finalPrice: '۲۱۰,۰۰۰ تومان',
        discountBadge: '٪۳۰',
      },
      {
        id: 'd2',
        title: 'عنوان تخفیف',
        businessName: 'عنوان کسب و کار ارایه دهنده تخفیف',
        imageSrc: '/public-panel/catalog/discount-2.png',
        postedAgo: '۲ ساعت پیش',
        rating: 4,
        reviewCount: 132,
        originalPrice: '۴۰۰,۰۰۰ تومان',
        finalPrice: '۲۱۰,۰۰۰ تومان',
        discountBadge: '۲۰۰ هزار تومان تخفیف',
      },
      {
        id: 'd3',
        title: 'عنوان تخفیف',
        businessName: 'عنوان کسب و کار ارایه دهنده تخفیف',
        imageSrc: '/public-panel/catalog/discount-3.png',
        postedAgo: '۲ ساعت پیش',
        rating: 4,
        reviewCount: 132,
        originalPrice: '۴۰۰,۰۰۰ تومان',
        finalPrice: '۲۱۰,۰۰۰ تومان',
        discountBadge: '٪۳۰',
      },
      {
        id: 'd4',
        title: 'عنوان تخفیف',
        businessName: 'عنوان کسب و کار ارایه دهنده تخفیف',
        imageSrc: '/public-panel/catalog/discount-4.png',
        postedAgo: 'سه روز پیش',
        rating: 4,
        reviewCount: 132,
        originalPrice: '۴۰۰,۰۰۰ تومان',
        finalPrice: '۲۱۰,۰۰۰ تومان',
        discountBadge: '٪۳۰',
      },
    ],
    news: [
      {
        id: 'n1',
        title: 'عنوان خبر',
        imageSrc: '/public-panel/catalog/news-1.png',
        viewCount: 215,
        scopeLabel: 'دانشگاهی',
        publisherType: 'نوع منتشر کننده',
        publishedAt: 'تاریخ انتشار',
        mainCategory: 'دسته بندی اصلی',
        subCategory: 'دسته بندی فرعی',
        summary:
          'بخشی از خبر یا خلاصه خبر در این قسمت آورده می‌شود لورم ایپسوم متن ساختگی با تولید محتوای نامفهوم جهت استفاده طراحان گرافیک است',
        eventRange: 'تاریخ شروع وقوع، تاریخ پایان وقوع',
      },
      {
        id: 'n2',
        title: 'عنوان خبر',
        imageSrc: '/public-panel/catalog/news-2.png',
        viewCount: 215,
        scopeLabel: 'بین المللی',
        publisherType: 'نوع منتشر کننده',
        publishedAt: 'تاریخ انتشار',
        mainCategory: 'دسته بندی اصلی',
        subCategory: 'دسته بندی فرعی',
        summary:
          'بخشی از خبر یا خلاصه خبر در این قسمت آورده می‌شود لورم ایپسوم متن ساختگی با تولید محتوای نامفهوم جهت استفاده طراحان گرافیک است',
        eventRange: 'تاریخ شروع وقوع، تاریخ پایان وقوع',
      },
      {
        id: 'n3',
        title: 'عنوان خبر',
        imageSrc: '/public-panel/catalog/news-3.png',
        viewCount: 215,
        scopeLabel: 'کشوری',
        publisherType: 'نوع منتشر کننده',
        publishedAt: 'تاریخ انتشار',
        mainCategory: 'دسته بندی اصلی',
        subCategory: 'دسته بندی فرعی',
        summary:
          'بخشی از خبر یا خلاصه خبر در این قسمت آورده می‌شود لورم ایپسوم متن ساختگی با تولید محتوای نامفهوم جهت استفاده طراحان گرافیک است',
        eventRange: 'تاریخ شروع وقوع، تاریخ پایان وقوع',
      },
    ],
    newsletters: [
      {
        id: 'nl1',
        title: 'عنوان خبر نامه',
        description: 'توضیحات اضافی در صورت وجود',
        imageSrc: '/public-panel/catalog/newsletter-1.png',
        publisherName: 'نام منتشر کننده',
        publisherInitial: 'A',
        publishedAt: '۱۴۰۵/۱۲/۰۵',
        rating: 4,
        reviewCount: 132,
      },
      {
        id: 'nl2',
        title: 'عنوان خبر نامه',
        description: 'توضیحات اضافی در صورت وجود',
        imageSrc: '/public-panel/catalog/newsletter-2.png',
        publisherName: 'نام منتشر کننده',
        publisherInitial: 'A',
        publishedAt: '۱۴۰۵/۱۲/۰۵',
        rating: 4,
        reviewCount: 132,
      },
      {
        id: 'nl3',
        title: 'عنوان خبر نامه',
        description: 'توضیحات اضافی در صورت وجود',
        imageSrc: '/public-panel/catalog/newsletter-3.png',
        publisherName: 'نام منتشر کننده',
        publisherInitial: 'A',
        publishedAt: '۱۴۰۵/۱۲/۰۵',
        rating: 4,
        reviewCount: 132,
      },
      {
        id: 'nl4',
        title: 'عنوان خبر نامه',
        description: 'توضیحات اضافی در صورت وجود',
        imageSrc: '/public-panel/catalog/newsletter-4.png',
        publisherName: 'نام منتشر کننده',
        publisherInitial: 'A',
        publishedAt: '۱۴۰۵/۱۲/۰۵',
        rating: 4,
        reviewCount: 132,
      },
    ],
  },
  otherInfo: [
    'ساعات پاسخگویی: شنبه تا چهارشنبه، ۱۰ تا ۱۸',
    'زبان‌ها: فارسی، انگلیسی',
    'حوزه تخصص: توسعه وب و تجربه کاربری',
  ],
  comments: [
    {
      id: 't1',
      authorName: 'صاحب پنل',
      authorHandle: 'panel_owner',
      authorAvatar: '/public-panel/avatar.png',
      body: 'این دیدگاه از پنل خصوصی به پنل عمومی منتقل شده است و برای بازدیدکنندگان قابل مشاهده است.',
      createdAt: '۲ ساعت پیش',
      kind: 'transferred',
      likes: 12,
      dislikes: 1,
      shares: 3,
      replies: [
        {
          id: 't1-r1',
          authorName: 'سارا کریمی',
          authorHandle: 'sara_k',
          body: 'ممنون از اشتراک‌گذاری این تجربه.',
          createdAt: '۱ ساعت پیش',
          kind: 'transferred',
          likes: 4,
          dislikes: 0,
          shares: 0,
          replyToName: 'صاحب پنل',
        },
      ],
    },
    {
      id: 't2',
      authorName: 'علی رضایی',
      authorHandle: 'ali_r',
      body: 'سوال من درباره زمان پاسخگویی بود که به اینجا منتقل شد.',
      createdAt: 'دیروز',
      kind: 'transferred',
      likes: 5,
      dislikes: 0,
      shares: 1,
    },
    {
      id: 't3',
      authorName: 'نگار موسوی',
      authorHandle: 'negar_m',
      body: 'پیشنهاد می‌کنم بخش سوابق تحصیلی هم تکمیل شود.',
      createdAt: '۳ روز پیش',
      kind: 'transferred',
      likes: 8,
      dislikes: 0,
      shares: 2,
    },
    {
      id: 'r1',
      authorName: 'سارا کریمی',
      authorHandle: 'sara_k',
      body: 'آیا امکان رزرو مشاوره برای هفته آینده وجود دارد؟',
      createdAt: '۵ ساعت پیش',
      kind: 'registered',
      featured: true,
      likes: 18,
      dislikes: 0,
      shares: 4,
      replies: [
        {
          id: 'r1-a1',
          authorName: 'صاحب پنل',
          authorHandle: 'panel_owner',
          authorAvatar: '/public-panel/avatar.png',
          body: 'بله، روزهای زوج از ساعت ۱۰ تا ۱۴ در دسترس هستم.',
          createdAt: '۴ ساعت پیش',
          kind: 'registered',
          likes: 9,
          dislikes: 0,
          shares: 0,
          replyToName: 'سارا کریمی',
        },
        {
          id: 'r1-a2',
          authorName: 'سارا کریمی',
          authorHandle: 'sara_k',
          body: 'عالی، حتماً هماهنگ می‌کنم.',
          createdAt: '۳ ساعت پیش',
          kind: 'registered',
          likes: 2,
          dislikes: 0,
          shares: 0,
          replyToName: 'صاحب پنل',
        },
      ],
    },
    {
      id: 'r2',
      authorName: 'محمد حسینی',
      authorHandle: 'm_hosseini',
      body: 'محتوای پنل خیلی کامل و کاربردی است، ممنون.',
      createdAt: '۱ روز پیش',
      kind: 'registered',
      likes: 7,
      dislikes: 0,
      shares: 1,
    },
    {
      id: 'r3',
      authorName: 'مریم احمدی',
      authorHandle: 'maryam_a',
      body: 'برای بازبینی رزومه چه مدارکی لازم است؟',
      createdAt: '۲ روز پیش',
      kind: 'registered',
      likes: 3,
      dislikes: 0,
      shares: 0,
      replies: [
        {
          id: 'r3-a1',
          authorName: 'صاحب پنل',
          authorHandle: 'panel_owner',
          authorAvatar: '/public-panel/avatar.png',
          body: 'رزومه به‌روز و لینک نمونه‌کار کافی است.',
          createdAt: '۲ روز پیش',
          kind: 'registered',
          likes: 6,
          dislikes: 0,
          shares: 0,
          replyToName: 'مریم احمدی',
        },
      ],
    },
  ],
};
