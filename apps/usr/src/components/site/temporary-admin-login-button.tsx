'use client';

import { ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

import { loginAsTemporaryAdmin } from '@auth/lib/temporary-admin-login';
import { PRIVATE_PANEL_PATH } from '@private-panel/data/private-panel-ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TemporaryAdminLoginButtonProps = {
  className?: string;
};

const TEMPORARY_ADMIN_ACTOR_ID = 2;
const TEMPORARY_ADMIN_PANEL_PATH = `${PRIVATE_PANEL_PATH}?actor_id=${TEMPORARY_ADMIN_ACTOR_ID}`;

export function TemporaryAdminLoginButton({
  className,
}: TemporaryAdminLoginButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const nextPath = searchParams.get('next');
  const redirectPath =
    nextPath?.startsWith('/') && !nextPath.startsWith('//')
      ? nextPath
      : TEMPORARY_ADMIN_PANEL_PATH;

  function handleClick() {
    setError(null);
    startTransition(async () => {
      try {
        await loginAsTemporaryAdmin();
        router.push(redirectPath);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ورود راهبر انجام نشد.');
      }
    });
  }

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <Button
        type="button"
        variant="outline"
        size="none"
        loading={isPending}
        onClick={handleClick}
        className={cn(
          'h-9 rounded-full border-primary/40 px-3 text-xs font-medium text-primary shadow-none',
          'hover:bg-primary/10 hover:text-primary',
          'min-[1280px]:h-10 min-[1280px]:px-4 min-[1280px]:text-sm',
        )}
      >
        <ShieldCheck className="size-4" aria-hidden />
        <span>ورود راهبر</span>
      </Button>
      {error ? (
        <span
          role="alert"
          className="absolute left-0 top-full mt-1 w-48 rounded-md bg-destructive px-2 py-1 text-right text-xs text-destructive-foreground shadow"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}
