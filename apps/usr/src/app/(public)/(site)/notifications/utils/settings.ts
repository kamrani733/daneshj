import { toActorChannelSettingRequest } from '@notifications/api';
import {
  flattenSettingsEvents,
  getCategoryIdByEventId,
  type ChannelSettingState,
} from '@notifications/data/settings-mock';

export type SettingsEventStates = Record<string, ChannelSettingState[]>;

export function cloneSettingsState(state: SettingsEventStates) {
  const next: SettingsEventStates = {};
  for (const [eventId, channels] of Object.entries(state)) {
    next[eventId] = channels.map((channel) => ({ ...channel }));
  }
  return next;
}

export function isSettingsDirty(
  current: SettingsEventStates,
  baseline: SettingsEventStates,
) {
  return JSON.stringify(current) !== JSON.stringify(baseline);
}

export function collectChangedSettings(
  current: SettingsEventStates,
  baseline: SettingsEventStates,
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
