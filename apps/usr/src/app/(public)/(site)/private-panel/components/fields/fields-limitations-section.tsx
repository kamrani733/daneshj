import { useTranslations } from 'next-intl';

import { useActorInfoQuery } from '@private-panel/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FieldsLimitationsSection({
  accessToken,
  t,
}: {
  accessToken?: string | null;
  t: ReturnType<typeof useTranslations>;
}) {
  const actorInfoQuery = useActorInfoQuery({ accessToken });
  const isBlocked = Boolean(actorInfoQuery.data?.blockStatus);

  if (!accessToken || actorInfoQuery.isLoading || !isBlocked) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          'relative rounded-3xl border border-[#dbd8d1] bg-[#f8f8f0] px-4 pb-6 pt-8',
          'min-[720px]:px-8 min-[720px]:pb-8',
          'dark:border-warning-50 dark:bg-app-card',
        )}
      >
        <h3 className="absolute -top-3 start-4 bg-[#f8f8f0] px-1 text-base font-semibold text-[#ba1a1a] dark:bg-app-card dark:text-warning-100">
          {t('limitations.blockedTitle')}
        </h3>

        <div className="flex flex-col gap-6">
          <p className="text-justify text-sm font-medium leading-6 text-[#404943] dark:text-app-filter-muted">
            {t('limitations.blockedBody')}
          </p>
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              disabled
              className={cn(
                'h-12 w-full max-w-[176px] !rounded-xl border border-[#e06333]',
                'bg-transparent px-4 text-sm font-medium text-[#e06333] shadow-none',
                'dark:border-warning-100 dark:text-warning-100',
                'disabled:opacity-50',
              )}
            >
              {t('limitations.requestLift')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
