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
