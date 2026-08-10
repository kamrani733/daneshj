export type GeoOption = {
  value: string;
  label: string;
};

export const COUNTRY_OPTIONS: GeoOption[] = [
  { value: 'IR', label: 'ایران' },
  { value: 'AF', label: 'افغانستان' },
  { value: 'IQ', label: 'عراق' },
  { value: 'TR', label: 'ترکیه' },
  { value: 'AE', label: 'امارات متحده عربی' },
  { value: 'SA', label: 'عربستان سعودی' },
  { value: 'PK', label: 'پاکستان' },
  { value: 'IN', label: 'هند' },
  { value: 'CN', label: 'چین' },
  { value: 'RU', label: 'روسیه' },
  { value: 'DE', label: 'آلمان' },
  { value: 'FR', label: 'فرانسه' },
  { value: 'GB', label: 'انگلستان' },
  { value: 'US', label: 'ایالات متحده' },
  { value: 'CA', label: 'کانادا' },
  { value: 'AU', label: 'استرالیا' },
  { value: 'NZ', label: 'نیوزیلند' },
  { value: 'JP', label: 'ژاپن' },
  { value: 'KR', label: 'کره جنوبی' },
  { value: 'MY', label: 'مالزی' },
  { value: 'MV', label: 'مالدیو' },
  { value: 'MA', label: 'مراکش' },
  { value: 'MX', label: 'مکزیک' },
  { value: 'HU', label: 'مجارستان' },
  { value: 'EG', label: 'مصر' },
  { value: 'NP', label: 'نپال' },
  { value: 'NI', label: 'نیکاراگوئه' },
  { value: 'NG', label: 'نیجریه' },
  { value: 'VA', label: 'واتیکان' },
];

export const IRAN_PROVINCE_OPTIONS: GeoOption[] = [
  { value: 'east-azerbaijan', label: 'آذربایجان شرقی' },
  { value: 'west-azerbaijan', label: 'آذربایجان غربی' },
  { value: 'ardabil', label: 'اردبیل' },
  { value: 'isfahan', label: 'اصفهان' },
  { value: 'alborz', label: 'البرز' },
  { value: 'ilam', label: 'ایلام' },
  { value: 'bushehr', label: 'بوشهر' },
  { value: 'tehran', label: 'تهران' },
  { value: 'chaharmahal', label: 'چهارمحال و بختیاری' },
  { value: 'south-khorasan', label: 'خراسان جنوبی' },
  { value: 'razavi-khorasan', label: 'خراسان رضوی' },
  { value: 'north-khorasan', label: 'خراسان شمالی' },
  { value: 'khuzestan', label: 'خوزستان' },
  { value: 'zanjan', label: 'زنجان' },
  { value: 'semnan', label: 'سمنان' },
  { value: 'sistan', label: 'سیستان و بلوچستان' },
  { value: 'fars', label: 'فارس' },
  { value: 'qazvin', label: 'قزوین' },
  { value: 'qom', label: 'قم' },
  { value: 'kurdistan', label: 'کردستان' },
  { value: 'kerman', label: 'کرمان' },
  { value: 'kermanshah', label: 'کرمانشاه' },
  { value: 'kohgiluyeh', label: 'کهگیلویه و بویراحمد' },
  { value: 'golestan', label: 'گلستان' },
  { value: 'gilan', label: 'گیلان' },
  { value: 'lorestan', label: 'لرستان' },
  { value: 'mazandaran', label: 'مازندران' },
  { value: 'markazi', label: 'مرکزی' },
  { value: 'hormozgan', label: 'هرمزگان' },
  { value: 'hamadan', label: 'همدان' },
  { value: 'yazd', label: 'یزد' },
];

export function provincesForCountry(countryCode: string): GeoOption[] {
  if (countryCode === 'IR') return IRAN_PROVINCE_OPTIONS;
  return [];
}
