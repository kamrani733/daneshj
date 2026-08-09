/** Mock private panel owner until Actor MS is wired. */

import type { PrivatePanelProfile } from './private-panel-ui';

export const MOCK_PRIVATE_PANEL: PrivatePanelProfile = {
  displayName: 'سعید سعیدی راد',
  username: 'saeedusername',
  roleLabelKey: 'student',
  location: 'تهران،دماوند،بخش یا روستا',
  bio: 'من دانشجویی علاقه‌مند به یادگیری مستمر، توسعه مهارت‌های فردی و حرفه‌ای و آشنایی با افراد خلاق و هم‌فکر هستم. باور دارم که دوران دانشجویی فرصت ارزشمندی برای کسب دانش، تجربه‌های عملی و ساختن مسیر شغلی آینده است.لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است،',
  avatarSrc: '/images/public-panel/avatar.png',
  electronicCardHref: '#',
  socialLinks: [
    { network: 'email', href: 'mailto:saeed@example.com' },
    { network: 'telegram', href: 'https://t.me/saeedusername' },
    { network: 'instagram', href: 'https://instagram.com/saeedusername' },
    { network: 'x', href: 'https://x.com/saeedusername' },
    { network: 'whatsapp', href: 'https://wa.me/989121234567' },
    { network: 'linkedin', href: 'https://linkedin.com/in/saeedusername' },
  ],
};
