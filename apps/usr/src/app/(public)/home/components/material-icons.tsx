import { cn } from '@/lib/utils';

type IconProps = {
  className?: string;
  /** Pixel size — Material icons are authored at 24×24. */
  size?: number;
};

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

/** @mui/icons-material FilterAltOutlined — Figma filter_alt (Style=Outlined). */
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

/** @mui/icons-material ImportExportOutlined — Figma import_export. */
export function ImportExportIcon({ className, size }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={size}
      path="M9 3 5 6.99h3V14h2V6.99h3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99z"
    />
  );
}

/** Material check for selected filter chip (18×18). */
export function ChipCheckIcon({ className }: IconProps) {
  return (
    <MaterialIcon
      className={className}
      size={18}
      path="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
    />
  );
}
