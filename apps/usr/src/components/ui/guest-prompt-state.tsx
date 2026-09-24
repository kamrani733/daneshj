import Link from 'next/link';

import { AUTH_ROUTES } from '@auth/lib/auth-routes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type GuestPromptStateProps = {
  message: string;
  loginLabel: string;
  loginHref?: string;
  className?: string;
};

export function GuestPromptState({
  message,
  loginLabel,
  loginHref = AUTH_ROUTES.login,
  className,
}: GuestPromptStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex min-h-[160px] w-full flex-col items-center justify-center gap-4 rounded-large bg-surface-container-lowest px-6 py-8',
        className
      )}
    >
      <p className="text-center text-body-medium text-on-surface">{message}</p>
      <Button asChild>
        <Link href={loginHref}>{loginLabel}</Link>
      </Button>
    </div>
  );
}
