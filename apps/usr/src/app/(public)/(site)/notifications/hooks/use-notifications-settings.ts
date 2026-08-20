'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  getNotificationApiErrorMessage,
  mergeActorSettingsIntoEventStates,
  useActorSettingsQuery,
  useApplyActorSettingsMutation,
} from '@notifications/api';
import {
  buildDefaultEventStates,
  type ChannelSettingState,
  type NotificationChannel,
} from '@notifications/data/settings-mock';
import {
  cloneSettingsState,
  collectChangedSettings,
  isSettingsDirty,
} from '@notifications/utils/settings';

type UseNotificationsSettingsPayload = {
  accessToken?: string | null;
};

export function useNotificationsSettings({
  accessToken,
}: UseNotificationsSettingsPayload) {
  const t = useTranslations('notifications.settings');
  const tRoot = useTranslations('notifications');
  const [openId, setOpenId] = useState<string | null>(null);
  const [baseline, setBaseline] = useState(buildDefaultEventStates);
  const [eventStates, setEventStates] = useState(() =>
    cloneSettingsState(buildDefaultEventStates()),
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  const settingsQuery = useActorSettingsQuery(accessToken);
  const applyMutation = useApplyActorSettingsMutation();

  useEffect(() => {
    if (!settingsQuery.data) return;
    const merged = mergeActorSettingsIntoEventStates(
      buildDefaultEventStates(),
      settingsQuery.data,
    );
    setBaseline(cloneSettingsState(merged));
    setEventStates(cloneSettingsState(merged));
  }, [settingsQuery.data]);

  const dirty = isSettingsDirty(eventStates, baseline);

  const updateChannel = (
    eventId: string,
    channel: NotificationChannel,
    patch: Partial<ChannelSettingState>,
  ) => {
    setSaveError(null);
    setEventStates((prev) => ({
      ...prev,
      [eventId]: (prev[eventId] ?? []).map((item) =>
        item.channel === channel ? { ...item, ...patch } : item,
      ),
    }));
  };

  const handleCancel = () => {
    setSaveError(null);
    setEventStates(cloneSettingsState(baseline));
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
      setBaseline(cloneSettingsState(eventStates));
    } catch (error) {
      setSaveError(
        getNotificationApiErrorMessage(error, t('saveFailed'), (key) =>
          tRoot(`apiErrors.${key}`),
        ),
      );
    }
  };

  return {
    applyMutation,
    dirty,
    eventStates,
    handleCancel,
    handleSave,
    openId,
    saveError,
    setOpenId,
    settingsQuery,
    updateChannel,
  };
}
