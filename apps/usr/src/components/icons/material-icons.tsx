import { cn } from '@/lib/utils';

type IconProps = {
  className?: string;
  /** Pixel size — Material icons are authored at 24×24. */
  size?: number;
};

/**
 * Thin SVG wrapper matching @mui/icons-material SvgIcon defaults
 * (24×24 viewBox, currentColor fill).
 */
function MaterialIcon({
  className,
  size = 24,
  path,
  fillRule,
}: IconProps & { path: string; fillRule?: 'evenodd' | 'nonzero' }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} fillRule={fillRule} />
    </svg>
  );
}

/** @mui/icons-material/FilterAltOutlined — Figma filter_alt (Style=Outlined). */
export function FilterAltIcon({ className, size }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      fillRule="evenodd"
      path="M7 6h10l-5.01 6.3zm-2.75-.39C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61"
    />
  );
}

/** @mui/icons-material/SortOutlined — Figma sort (#66:3033). */
export function SortIcon({ className, size }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      path="M3 18h6v-2H3zM3 6v2h18V6zm0 7h12v-2H3z"
    />
  );
}

/** @mui/icons-material/Check — selected filter chip / menu item (18×18 in chips). */
export function CheckIcon({ className, size = 24 }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      path="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
    />
  );
}

/** Selected filter chip leading check — Figma 18×18. */
export function ChipCheckIcon({ className }: IconProps) {
  return <CheckIcon className={className} size={18} />;
}

/** Material format_list_bulleted — operational panel «سرویس های استفاده شده». */
export function FormatListBulletedIcon({ className, size }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      path="M7 9V7h14v2zm0 4v-2h14v2zm0 4v-2h14v2zM4 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2"
    />
  );
}

/** Material archive (outlined) — operational panel «مدیریت سرویس ها». */
export function ArchiveIcon({ className, size }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      path="M20.54 5.23 19.15 3.55C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27M6.24 5h11.52l.81.97H5.44zM5 19V8h14v11zm8.45-9h-2.9v3H8l4 4 4-4h-2.55z"
    />
  );
}

/** Material account_balance_wallet (outlined) — operational panel «کیف پول». */
export function WalletIcon({ className, size }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      path="M20.5 7.28V5c0-1.1-.9-2-2-2h-14c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72M19.5 9v6h-7V9zm-15 10V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2zm11-5.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S14 11.17 14 12s.67 1.5 1.5 1.5"
    />
  );
}

/** Material assignment (outlined) — operational panel «گزارشات». */
export function AssignmentIcon({ className, size }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      path="M7 16h7v2H7zm0-4h10v2H7zm0-4h10v2H7zm12-4h-4.18C14.4 2.84 13.3 2 12 2s-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04-.39.08-.74.28-1.01.55-.18.18-.33.4-.43.64-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75M19 20H5V6h14z"
    />
  );
}

/** Material assessment (outlined) — operational panel «آمار». */
export function AssessmentIcon({ className, size }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      path="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"
    />
  );
}

/** Material bar_chart — operational panel «نمودار». */
export function BarChartIcon({ className, size }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      path="M8 9H4v11h4zm12 4h-4v7h4zm-6-9h-4v16h4z"
    />
  );
}

/** Material recommend (outlined) — operational panel «مشاهده تعاملات». */
export function RecommendIcon({ className, size }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m5-10h-4.59l.58-3.41v-.2c-.01-.26-.12-.51-.3-.7L12 5l-4.6 5c-.27.26-.42.62-.4 1v5c0 1.1.9 2 2 2h5.5c.56.03 1.08-.29 1.3-.8l2.1-4.9c.08-.15.12-.33.1-.5V11c0-.55-.45-1-1-1"
    />
  );
}

/** Material done — operational panel stat cards (exact export path). */
export function DoneIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M10 16.4L6 12.4L7.4 11L10 13.6L16.6 7L18 8.4L10 16.4Z" />;
}

/** Material edit — operational panel stat cards (exact export path). */
export function EditIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z" />;
}

/** Material forum — operational panel stat cards (exact export path). */
export function ForumIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M15 4V11H5.17L4 12.17V4H15ZM16 2H3C2.45 2 2 2.45 2 3V17L6 13H16C16.55 13 17 12.55 17 12V3C17 2.45 16.55 2 16 2ZM21 6H19V15H6V17C6 17.55 6.45 18 7 18H18L22 22V7C22 6.45 21.55 6 21 6Z" />;
}

/** Material cancel — operational panel stat cards (exact export path). */
export function CancelIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M8.4 17L12 13.4L15.6 17L17 15.6L13.4 12L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4L10.6 12L7 15.6L8.4 17ZM12 22C10.62 22 9.32 21.74 8.1 21.21C6.88 20.69 5.82 19.98 4.92 19.08C4.02 18.18 3.31 17.12 2.79 15.9C2.26 14.68 2 13.38 2 12C2 10.62 2.26 9.32 2.79 8.1C3.31 6.88 4.02 5.83 4.92 4.93C5.82 4.03 6.88 3.31 8.1 2.79C9.32 2.26 10.62 2 12 2C13.38 2 14.68 2.26 15.9 2.79C17.12 3.31 18.17 4.03 19.07 4.93C19.97 5.83 20.69 6.88 21.21 8.1C21.74 9.32 22 10.62 22 12C22 13.38 21.74 14.68 21.21 15.9C20.69 17.12 19.97 18.18 19.07 19.08C18.17 19.98 17.12 20.69 15.9 21.21C14.68 21.74 13.38 22 12 22ZM12 20C14.23 20 16.12 19.23 17.67 17.68C19.22 16.13 20 14.23 20 12C20 9.77 19.22 7.88 17.67 6.33C16.12 4.78 14.23 4 12 4C9.77 4 7.87 4.78 6.32 6.33C4.77 7.88 4 9.77 4 12C4 14.23 4.77 16.13 6.32 17.68C7.87 19.23 9.77 20 12 20Z" />;
}

/** Material move_to_inbox — operational panel stat cards (exact export path). */
export function MoveToInboxIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M16 9H13.45V6H10.55V9H8L12 13L16 9ZM19 3H4.99C3.88 3 3 3.9 3 5V19C3 20.1 3.88 21 4.99 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V16H8.56C9.25 17.19 10.53 18 12.01 18C13.49 18 14.76 17.19 15.46 16H19V19ZM19 14H14.01C14.01 15.1 13.11 16 12.01 16C10.91 16 10.01 15.1 10.01 14H5L4.99 5H19V14Z" />;
}

/** Material thumb_up (filled) — operational panel stat cards (exact export path). */
export function ThumbUpFilledIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M9 22H18C18.83 22 19.54 21.5 19.84 20.78L22.86 13.73C22.95 13.5 23 13.26 23 13V11C23 9.9 22.1 9 21 9H14.69L15.64 4.43L15.67 4.11C15.67 3.7 15.5 3.32 15.23 3.05L14.17 2L7.58 8.59C7.22 8.95 7 9.45 7 10V20C7 21.1 7.9 22 9 22ZM9 10L13.34 5.66L12 11H21V13L18 20H9V10ZM1 10H5V22H1V10Z" />;
}

/** Material adjust — operational panel stat cards (exact export path). */
export function AdjustIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M19.74 18.34C21.15 16.6 22 14.4 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C14.4 22 16.6 21.16 18.33 19.74C18.6 19.52 18.86 19.28 19.11 19.03C19.14 19 19.16 18.97 19.18 18.95C19.38 18.76 19.57 18.54 19.74 18.34ZM12 20C7.59 20 4 16.42 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 13.85 19.37 15.54 18.31 16.9L16.88 15.47C17.57 14.49 17.98 13.3 17.98 12.01C17.98 8.7 15.29 6.01 11.98 6.01C8.67 6.01 5.98 8.7 5.98 12.01C5.98 15.32 8.67 18.01 11.98 18.01C13.28 18.01 14.49 17.59 15.47 16.88L16.89 18.3C15.54 19.37 13.85 20 12 20ZM13.92 12.51C14.09 11.85 13.94 11.13 13.43 10.61L13.41 10.59C12.64 9.82 11.41 9.81 10.63 10.55C10.62 10.56 10.6 10.57 10.58 10.59C9.8 11.37 9.8 12.64 10.58 13.42L10.6 13.44C11.12 13.95 11.85 14.11 12.51 13.93L14.02 15.44C13.42 15.8 12.73 16.02 11.98 16.02C9.77 16.02 7.98 14.23 7.98 12.02C7.98 9.81 9.77 8.02 11.98 8.02C14.19 8.02 15.98 9.81 15.98 12.02C15.98 12.75 15.77 13.43 15.42 14.02L13.92 12.51Z" />;
}

/** Material star — operational panel stat cards (exact export path). */
export function StarIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M12 17.77L18.18 21.5L16.54 14.47L22 9.74L14.81 9.13L12 2.5L9.19 9.13L2 9.74L7.46 14.47L5.82 21.5L12 17.77Z" />;
}

/** Material thumb_up — operational panel stat cards (exact export path). */
export function ThumbUpIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M9 22H18C18.83 22 19.54 21.5 19.84 20.78L22.86 13.73C22.95 13.5 23 13.26 23 13V11C23 9.9 22.1 9 21 9H14.69L15.64 4.43L15.67 4.12C15.67 3.7 15.5 3.32 15.23 3.05L14.17 2L7.58 8.59C7.22 8.95 7 9.46 7 10V20C7 21.1 7.9 22 9 22ZM9 10L13.34 5.66L12 11H21V13L18 20H9V10ZM1 10H5V22H1V10Z" />;
}

/** Material trending_up — operational panel stat cards (exact export path). */
export function TrendingUpIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M16 6L18.29 8.29L13.41 13.16L9.41 9.17L2 16.58L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" />;
}

/** Material south_west — operational panel stat cards (exact export path). */
export function SouthWestIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M16 18H6V8H9V12.77L15.98 6L18 8.03L11.15 15H16V18Z" />;
}

/** Material compare_arrows — operational panel stat cards (exact export path). */
export function CompareArrowsIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M9.01 14H2V16H9.01V19L13 15L9.01 11V14ZM14.99 13V10H22V8H14.99V5L11 9L14.99 13Z" />;
}

/** Material reply — operational panel stat cards (exact export path). */
export function ReplyIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M19 19V15C19 14.17 18.71 13.46 18.12 12.88C17.54 12.29 16.83 12 16 12H6.83L10.43 15.6L9 17L3 11L9 5L10.43 6.4L6.83 10H16C17.38 10 18.56 10.49 19.54 11.46C20.51 12.44 21 13.62 21 15V19H19Z" />;
}

/** Material comment — operational panel stat cards (exact export path). */
export function CommentIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M6 14H18V12H6V14ZM6 11H18V9H6V11ZM6 8H18V6H6V8ZM22 22L18 18H4C3.45 18 2.98 17.81 2.59 17.41C2.19 17.03 2 16.55 2 16V4C2 3.46 2.19 2.98 2.59 2.59C2.98 2.2 3.45 2 4 2H20C20.55 2 21.02 2.2 21.41 2.59C21.8 2.98 22 3.46 22 4V22ZM4 16H18.85L20 17.12V4H4V16Z" />;
}

/** Material thumb_down — operational panel stat cards (exact export path). */
export function ThumbDownIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M15 2H6C5.17 2 4.46 2.5 4.16 3.22L1.14 10.27C1.05 10.5 1 10.74 1 11V13C1 14.1 1.9 15 3 15H9.31L8.36 19.57L8.33 19.9C8.33 20.3 8.5 20.68 8.77 20.95L9.83 22L16.42 15.41C16.78 15.05 17 14.56 17 14V4C17 2.9 16.1 2 15 2ZM15 14L10.66 18.34L12 13H3V11L6 4H15V14ZM19 2H23V14H19V2Z" />;
}

/** Material report — operational panel stat cards (exact export path). */
export function ReportIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3ZM19 14.9L14.9 19H9.1L5 14.9V9.1L9.1 5H14.9L19 9.1V14.9ZM12 17C12.55 17 13 16.55 13 16C13 15.44 12.55 15 12 15C11.45 15 11 15.44 11 16C11 16.55 11.45 17 12 17ZM11 7H13V14H11V7Z" />;
}

/** Material block — operational panel stat cards (exact export path). */
export function BlockIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 7.58 7.58 4 12 4C13.85 4 15.55 4.63 16.9 5.69L5.69 16.9C4.63 15.55 4 13.85 4 12ZM12 20C10.15 20 8.45 19.37 7.1 18.31L18.31 7.1C19.37 8.45 20 10.15 20 12C20 16.42 16.42 20 12 20Z" />;
}

/** Material notifications — operational panel stat cards (exact export path). */
export function NotificationsIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M12 21.74C13.1 21.74 14 20.86 14 19.75H10C10 20.86 10.9 21.74 12 21.74ZM18 15.74V10.75C18 7.68 16.37 5.11 13.5 4.43V3.74C13.5 2.92 12.83 2.26 12 2.26C11.17 2.26 10.5 2.92 10.5 3.74V4.43C7.64 5.11 6 7.67 6 10.75V15.74L4 17.75V18.74H20V17.75L18 15.74ZM16 16.75H8V10.75C8 8.27 9.51 6.25 12 6.25C14.49 6.25 16 8.27 16 10.75V16.75Z" />;
}

/** Material link — operational panel stat cards (exact export path). */
export function LinkIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M17 7H13V9H17C18.65 9 20 10.34 20 12C20 13.64 18.65 15 17 15H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7ZM11 15H7C5.35 15 4 13.64 4 12C4 10.34 5.35 9 7 9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15ZM8 11H16V13H8V11Z" />;
}

/** Material mark_email_unread — operational panel stat cards (exact export path). */
export function MarkEmailUnreadIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M22 9.98V19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19L2.01 7C2.01 5.9 2.9 5 4 5H14.1C14.04 5.32 14 5.66 14 6C14 6.34 14.04 6.68 14.1 7H4L12 12L15.67 9.71C16.14 10.14 16.69 10.46 17.3 10.69L12 14L4 9V19H20V10.9C20.74 10.75 21.42 10.42 22 9.98ZM16 6C16 7.66 17.34 9 19 9C20.66 9 22 7.66 22 6C22 4.34 20.66 3 19 3C17.34 3 16 4.34 16 6Z" />;
}

/** Material headset_mic — operational panel stat cards (exact export path). */
export function HeadsetMicIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M19 14V18H17V14H19ZM7 14V18H6C5.45 18 5 17.54 5 17V14H7ZM12 1C7.03 1 3 5.03 3 10V17C3 18.66 4.34 20 6 20H9V12H5V10C5 6.13 8.13 3 12 3C15.87 3 19 6.13 19 10V12H15V20H19V21H12V23H18C19.66 23 21 21.66 21 20V10C21 5.03 16.97 1 12 1Z" />;
}

/** Material confirmation_number — operational panel stat cards (exact export path). */
export function ConfirmationNumberIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M22 10V6C22 4.88 21.1 4 20 4H4C2.9 4 2.01 4.88 2.01 6V10C3.11 10 4 10.9 4 12C4 13.1 3.11 14 2 14V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V14C20.9 14 20 13.1 20 12C20 10.9 20.9 10 22 10ZM20 8.54C18.81 9.23 18 10.52 18 12C18 13.46 18.81 14.77 20 15.46V18H4V15.46C5.19 14.77 6 13.46 6 12C6 10.52 5.2 9.23 4.01 8.54L4 6H20V8.54ZM11 15H13V17H11V15ZM11 11H13V13H11V11ZM11 7H13V9H11V7Z" />;
}

/** Material support_agent — operational panel stat cards (exact export path). */
export function SupportAgentIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M21 12.22C21 6.73 16.74 3 12 3C7.31 3 3 6.65 3 12.28C2.4 12.62 2 13.26 2 14V16C2 17.1 2.9 18 4 18H5V11.9C5 8.03 8.13 4.9 12 4.9C15.87 4.9 19 8.03 19 11.9V19H11V21H19C20.1 21 21 20.1 21 19V17.78C21.59 17.47 22 16.86 22 16.14V13.84C22 13.14 21.59 12.53 21 12.22ZM9 14C9.55 14 10 13.55 10 13C10 12.44 9.55 12 9 12C8.45 12 8 12.44 8 13C8 13.55 8.45 14 9 14ZM15 14C15.55 14 16 13.55 16 13C16 12.44 15.55 12 15 12C14.45 12 14 12.44 14 13C14 13.55 14.45 14 15 14ZM18 11.03C17.52 8.18 15.04 6 12.05 6C9.02 6 5.76 8.51 6.02 12.44C8.49 11.44 10.35 9.24 10.88 6.56C12.19 9.19 14.88 11 18 11.03Z" />;
}

/** Material share — operational panel stat cards (exact export path). */
export function ShareIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M18 22C17.17 22 16.46 21.71 15.87 21.13C15.29 20.54 15 19.84 15 19C15 18.89 15.01 18.77 15.03 18.64C15.04 18.52 15.07 18.4 15.1 18.3L8.05 14.2C7.77 14.45 7.45 14.65 7.1 14.78C6.75 14.93 6.38 15 6 15C5.17 15 4.46 14.71 3.87 14.12C3.29 13.55 3 12.84 3 12C3 11.17 3.29 10.46 3.87 9.88C4.46 9.29 5.17 9 6 9C6.38 9 6.75 9.07 7.1 9.22C7.45 9.36 7.77 9.55 8.05 9.8L15.1 5.7C15.07 5.6 15.04 5.48 15.03 5.36C15.01 5.24 15 5.12 15 5C15 4.16 15.29 3.46 15.87 2.88C16.46 2.29 17.17 2 18 2C18.83 2 19.54 2.29 20.13 2.88C20.71 3.46 21 4.16 21 5C21 5.83 20.71 6.54 20.13 7.13C19.54 7.7 18.83 8 18 8C17.62 8 17.25 7.93 16.9 7.79C16.55 7.64 16.23 7.45 15.95 7.2L8.9 11.3C8.93 11.4 8.96 11.52 8.97 11.64C8.99 11.76 9 11.88 9 12C9 12.12 8.99 12.24 8.97 12.36C8.96 12.49 8.93 12.6 8.9 12.7L15.95 16.8C16.23 16.55 16.55 16.36 16.9 16.21C17.25 16.07 17.62 16 18 16C18.83 16 19.54 16.3 20.13 16.87C20.71 17.46 21 18.17 21 19C21 19.84 20.71 20.54 20.13 21.13C19.54 21.71 18.83 22 18 22ZM18 6C18.28 6 18.52 5.9 18.71 5.71C18.9 5.52 19 5.28 19 5C19 4.72 18.9 4.48 18.71 4.28C18.52 4.09 18.28 4 18 4C17.72 4 17.48 4.09 17.29 4.28C17.1 4.48 17 4.72 17 5C17 5.28 17.1 5.52 17.29 5.71C17.48 5.9 17.72 6 18 6ZM6 13C6.28 13 6.52 12.9 6.71 12.72C6.9 12.53 7 12.29 7 12C7 11.72 6.9 11.48 6.71 11.29C6.52 11.1 6.28 11 6 11C5.72 11 5.48 11.1 5.29 11.29C5.1 11.48 5 11.72 5 12C5 12.29 5.1 12.53 5.29 12.72C5.48 12.9 5.72 13 6 13ZM18 20C18.28 20 18.52 19.91 18.71 19.72C18.9 19.52 19 19.28 19 19C19 18.72 18.9 18.48 18.71 18.29C18.52 18.1 18.28 18 18 18C17.72 18 17.48 18.1 17.29 18.29C17.1 18.48 17 18.72 17 19C17 19.28 17.1 19.52 17.29 19.72C17.48 19.91 17.72 20 18 20Z" />;
}

/** Material ads_click — operational panel stat cards (exact export path). */
export function AdsClickIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M11.46 17.74C8.28 17.59 5.75 14.96 5.75 11.75C5.75 8.44 8.44 5.75 11.75 5.75C14.97 5.75 17.59 8.28 17.74 11.46L15.64 10.82C15.23 9.06 13.64 7.75 11.75 7.75C9.54 7.75 7.75 9.54 7.75 11.75C7.75 13.64 9.06 15.23 10.83 15.64L11.46 17.74ZM21.75 11.75C21.75 12.05 21.74 12.35 21.71 12.65L19.74 12.06C19.75 11.96 19.75 11.84 19.75 11.75C19.75 7.33 16.17 3.74 11.75 3.74C7.33 3.74 3.75 7.33 3.75 11.75C3.75 16.16 7.33 19.75 11.75 19.75C11.85 19.75 11.96 19.75 12.06 19.74L12.65 21.71C12.35 21.74 12.05 21.74 11.75 21.74C6.23 21.74 1.75 17.27 1.75 11.75C1.75 6.23 6.23 1.75 11.75 1.75C17.27 1.75 21.75 6.23 21.75 11.75ZM17.98 16.01L21.75 14.75L11.75 11.75L14.75 21.74L16.01 17.98L20.28 22.25L22.26 20.27L17.98 16.01Z" />;
}

/** Material emoji_events — operational panel stat cards (exact export path). */
export function EmojiEventsIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M19 5H17V3H7V5H5C3.9 5 3 5.9 3 7V8C3 10.55 4.92 12.62 7.39 12.94C8.02 14.44 9.37 15.56 11 15.9V19H7V21H17V19H13V15.9C14.63 15.56 15.98 14.44 16.61 12.94C19.08 12.62 21 10.55 21 8V7C21 5.9 20.1 5 19 5ZM5 8V7H7V10.82C5.84 10.4 5 9.3 5 8ZM12 14C10.35 14 9 12.65 9 11V5H15V11C15 12.65 13.65 14 12 14ZM19 8C19 9.3 18.16 10.4 17 10.82V7H19V8Z" />;
}

/** Material verified_user — operational panel stat cards (exact export path). */
export function VerifiedUserIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM19 11C19 15.52 16.02 19.69 12 20.93C7.98 19.69 5 15.52 5 11V6.3L12 3.19L19 6.3V11ZM7.41 11.59L6 13L10 17L18 9L16.59 7.58L10 14.17L7.41 11.59Z" />;
}

/** Material workspace_premium — operational panel stat cards (exact export path). */
export function WorkspacePremiumIcon({ className, size }: IconProps) {
  return <MaterialIcon className={className} size={size} path="M9.68 13.19L12 11.42L14.31 13.19L13.43 10.34L15.75 8.5H12.91L12 5.69L11.09 8.5H8.25L10.56 10.34L9.68 13.19ZM20 9.5C20 5.08 16.42 1.5 12 1.5C7.58 1.5 4 5.08 4 9.5C4 11.53 4.76 13.37 6 14.78V22.5L12 20.5L18 22.5V14.78C19.24 13.37 20 11.53 20 9.5ZM12 3.5C15.31 3.5 18 6.19 18 9.5C18 12.82 15.31 15.5 12 15.5C8.69 15.5 6 12.82 6 9.5C6 6.19 8.69 3.5 12 3.5ZM12 18.5L8 19.52V16.42C9.18 17.1 10.54 17.5 12 17.5C13.46 17.5 14.82 17.1 16 16.42V19.52L12 18.5Z" />;
}
