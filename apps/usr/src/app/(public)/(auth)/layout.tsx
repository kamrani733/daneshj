'use client';

import { usePathname } from 'next/navigation';

import { AuthShell, type AuthCardStep } from '@/components/auth/auth-shell';

function resolveCardStep(pathname: string): AuthCardStep {
  const last = pathname.split('/').filter(Boolean).at(-1);
  if (last === 'otp' || last === 'totp' || last === 'reset' || last === 'sessions') {
    return 'otp';
  }
  return 'identifier';
}

function resolveBackHref(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return '/';
  return `/${segments.slice(0, -1).join('/')}`;
}

/** Shared shell for login, register, and forgot-password flows. */
export default function AuthFlowLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const step = resolveCardStep(pathname);
  const backHref = resolveBackHref(pathname);

  return (
    <AuthShell backHref={backHref} step={step}>
      {children}
    </AuthShell>
  );
}
