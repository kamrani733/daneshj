'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { NOTIFICATIONS_PATH } from '@notifications/data/notifications-ui';
import {
  useActorSettingsQuery,
  useApplyActorSettingsMutation,
  getNotificationApiErrorMessage,
  mergeActorSettingsIntoEventStates,
  toActorChannelSettingRequest,
} from '@notifications/api';
import {
  SETTINGS_SECTIONS,
  buildDefaultEventStates,
  flattenSettingsEvents,
  getCategoryIdByEventId,
  type ChannelSettingState,
  type NotificationChannel,
} from '@notifications/data/settings-mock';
import { Spinner } from '@/components/ui/spinner';

import { AccentMark } from '@/components/site/accent-mark';
import { SettingsCategoryAccordion } from './category-accordion';
import { SettingsFloatingActions } from './floating-actions';

function cloneState(state: Record<string, ChannelSettingState[]>) {
  const next: Record<string, ChannelSettingState[]> = {};
  for (const [eventId, channels] of Object.entries(state)) {
    next[eventId] = channels.map((channel) => ({ ...channel }));
  }
  return next;
}

function isDirty(
  current: Record<string, ChannelSettingState[]>,
  baseline: Record<string, ChannelSettingState[]>
) {
  return JSON.stringify(current) !== JSON.stringify(baseline);
}

function collectChangedSettings(
  current: Record<string, ChannelSettingState[]>,
  baseline: Record<string, ChannelSettingState[]>
) {
  const settings: Array<{
    categoryId: number;
    channels: ReturnType<typeof toActorChannelSettingRequest>;
  }> = [];

  for (const eventItem of flattenSettingsEvents()) {
    const currentChannels = current[eventItem.id];
    const baselineChannels = baseline[eventItem.id];
    if (!currentChannels || !baselineChannels) continue;
    if (JSON.stringify(currentChannels) === JSON.stringify(baselineChannels)) {
      continue;
    }
    const categoryId = getCategoryIdByEventId(eventItem.id);
    if (categoryId == null) continue;
    settings.push({
      categoryId,
      channels: toActorChannelSettingRequest(currentChannels),
    });
  }

  return settings;
}

type NotificationsSettingsViewProps = {
  accessToken?: string | null;
};

/** Figma notification settings — load/list + create via actor-settings APIs. */
export function NotificationsSettingsView({
  accessToken,
}: NotificationsSettingsViewProps) {
  const t = useTranslations('notifications.settings');
  const tRoot = useTranslations('notifications');
  const [openId, setOpenId] = useState<string | null>(null);
  const [baseline, setBaseline] = useState(buildDefaultEventStates);
  const [eventStates, setEventStates] = useState(() =>
    cloneState(buildDefaultEventStates())
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  const settingsQuery = useActorSettingsQuery(accessToken);
  const applyMutation = useApplyActorSettingsMutation();

  useEffect(() => {
    if (!settingsQuery.data) return;
    const merged = mergeActorSettingsIntoEventStates(
      buildDefaultEventStates(),
      settingsQuery.data
    );
    setBaseline(cloneState(merged));
    setEventStates(cloneState(merged));
  }, [settingsQuery.data]);

  const dirty = isDirty(eventStates, baseline);

  const updateChannel = (
    eventId: string,
    channel: NotificationChannel,
    patch: Partial<ChannelSettingState>
  ) => {
    setSaveError(null);
    setEventStates((prev) => ({
      ...prev,
      [eventId]: (prev[eventId] ?? []).map((item) =>
        item.channel === channel ? { ...item, ...patch } : item
      ),
    }));
  };

  const handleCancel = () => {
    setSaveError(null);
    setEventStates(cloneState(baseline));
  };

  const handleSave = async () => {
    setSaveError(null);
    const settings = collectChangedSettings(eventStates, baseline);
    if (settings.length === 0) return;

    try {
      await applyMutation.mutateAsync({
        accessToken: accessToken ?? '',
        settings,
      });
      setBaseline(cloneState(eventStates));
    } catch (error) {
      setSaveError(
        getNotificationApiErrorMessage(error, t('saveFailed'), (key) =>
          tRoot(`apiErrors.${key}`)
        )
      );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1364px] flex-col gap-6 px-4 py-4 min-[1200px]:px-0">
      <header className="flex w-full flex-col gap-6">
        <nav
          aria-label={tRoot('breadcrumb.label')}
          className="flex items-center gap-2 text-sm"
        >
          <span className="font-semibold leading-5 tracking-[0.0071em] text-green-700 dark:text-primary-100">
            {t('breadcrumbCurrent')}
          </span>
          <ChevronLeft
            className="size-5 shrink-0 text-neutral-600 dark:text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <Link
            href={NOTIFICATIONS_PATH}
            className="font-medium leading-5 tracking-[0.0071em] text-neutral-600 hover:text-green-700 dark:text-muted-foreground dark:hover:text-primary-100"
          >
            {tRoot('breadcrumb.current')}
          </Link>
          <ChevronLeft
            className="size-5 shrink-0 text-neutral-600 dark:text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <Link
            href="/"
            className="font-medium leading-5 tracking-[0.0071em] text-neutral-600 hover:text-green-700 dark:text-muted-foreground dark:hover:text-primary-100"
          >
            {tRoot('breadcrumb.home')}
          </Link>
        </nav>

        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-2">
            <AccentMark size="lg" />
            <h1 className="text-[32px] font-bold leading-10 text-primary-700 dark:text-primary-100">
              {t('title')}
            </h1>
          </div>
          <Link
            href={NOTIFICATIONS_PATH}
            className="inline-flex items-center gap-1 text-sm font-medium leading-5 text-primary hover:underline dark:text-primary-100"
          >
            <span>{t('back')}</span>
            <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </header>

      {settingsQuery.isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-home-filter-muted">
          <Spinner className="size-5" />
          <span className="text-sm">{t('loading')}</span>
        </div>
      ) : (
        <div
          className={
            dirty ? 'flex flex-col gap-10 pb-24' : 'flex flex-col gap-10'
          }
        >
          {SETTINGS_SECTIONS.map((section) => (
            <section key={section.id} className="flex flex-col gap-3">
              <h2 className="text-start text-base font-bold leading-6 text-primary-700 dark:text-primary-100 min-[720px]:text-lg min-[720px]:leading-7">
                {t(section.titleKey)}
              </h2>

              <div className="flex flex-col gap-3">
                {section.categories.map((category) => (
                  <SettingsCategoryAccordion
                    key={category.id}
                    category={category}
                    open={openId === category.id}
                    onToggle={() =>
                      setOpenId((current) =>
                        current === category.id ? null : category.id
                      )
                    }
                    eventStates={eventStates}
                    onEnabledChange={(eventId, channel, isEnabled) =>
                      updateChannel(eventId, channel, { isEnabled })
                    }
                    onPeriodChange={(eventId, channel, receivePeriod) =>
                      updateChannel(eventId, channel, { receivePeriod })
                    }
                    onTimeChange={(eventId, channel, field, value) =>
                      updateChannel(eventId, channel, {
                        [field]: value || null,
                      })
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {saveError ? (
        <p className="text-sm text-destructive" role="alert">
          {saveError}
        </p>
      ) : null}

      {dirty ? (
        <SettingsFloatingActions
          onCancel={handleCancel}
          onSave={() => {
            void handleSave();
          }}
          saving={applyMutation.isPending}
        />
      ) : null}
    </div>
  );
}
