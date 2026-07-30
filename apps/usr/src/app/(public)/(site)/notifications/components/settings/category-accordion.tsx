'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type {
  ChannelSettingState,
  NotificationChannel,
  ReceivePeriod,
  SettingsCategory,
  SettingsEvent,
} from '@notifications/data/settings-mock';
import { SETTINGS_CHANNELS } from '@notifications/data/settings-mock';

import { SettingsChannelControl } from './channel-control';

type SettingsCategoryAccordionProps = {
  category: SettingsCategory;
  open: boolean;
  onToggle: () => void;
  eventStates: Record<string, ChannelSettingState[]>;
  onEnabledChange: (
    eventId: string,
    channel: NotificationChannel,
    isEnabled: boolean
  ) => void;
  onPeriodChange: (
    eventId: string,
    channel: NotificationChannel,
    period: ReceivePeriod
  ) => void;
  onTimeChange: (
    eventId: string,
    channel: NotificationChannel,
    field: 'receiveTimeStart' | 'receiveTimeEnd',
    value: string
  ) => void;
};

/** Figma Default/Wide setting row — cream 16px card; label end · chevron start. */
export function SettingsCategoryAccordion({
  category,
  open,
  onToggle,
  eventStates,
  onEnabledChange,
  onPeriodChange,
  onTimeChange,
}: SettingsCategoryAccordionProps) {
  const t = useTranslations('notifications.settings');
  const panelId = `settings-panel-${category.id}`;
  const headerId = `settings-header-${category.id}`;
  const Chevron = open ? ChevronUp : ChevronDown;

  return (
    <div className="rounded-2xl bg-home-search-fill px-4 py-4">
      <h3>
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-3"
        >
          {/* RTL: first child = right (label), second = left (chevron) */}
          <span className="text-base font-bold leading-6 tracking-[0.0094em] text-home-filter-ink">
            {t(`categories.${category.titleKey}`)}
          </span>
          <Chevron
            className="size-6 shrink-0 text-home-filter-muted"
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
      </h3>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className="mt-6 flex flex-col gap-6"
        >
          {category.events.map((event) => (
            <SettingsEventBlock
              key={event.id}
              event={event}
              channels={eventStates[event.id] ?? event.channels}
              onEnabledChange={(channel, isEnabled) =>
                onEnabledChange(event.id, channel, isEnabled)
              }
              onPeriodChange={(channel, period) =>
                onPeriodChange(event.id, channel, period)
              }
              onTimeChange={(channel, field, value) =>
                onTimeChange(event.id, channel, field, value)
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SettingsEventBlock({
  event,
  channels,
  onEnabledChange,
  onPeriodChange,
  onTimeChange,
}: {
  event: SettingsEvent;
  channels: ChannelSettingState[];
  onEnabledChange: (channel: NotificationChannel, isEnabled: boolean) => void;
  onPeriodChange: (channel: NotificationChannel, period: ReceivePeriod) => void;
  onTimeChange: (
    channel: NotificationChannel,
    field: 'receiveTimeStart' | 'receiveTimeEnd',
    value: string
  ) => void;
}) {
  const t = useTranslations('notifications.settings');
  const byChannel = Object.fromEntries(
    channels.map((item) => [item.channel, item])
  ) as Record<NotificationChannel, ChannelSettingState>;

  return (
    <div className="flex flex-col items-stretch gap-[22px]">
      <h4 className="text-start text-base font-bold leading-6 tracking-[0.0094em] text-home-filter-ink">
        {t(`events.${event.titleKey}`)}
      </h4>
      <div className="grid grid-cols-1 gap-6 min-[560px]:grid-cols-2 min-[960px]:grid-cols-4">
        {SETTINGS_CHANNELS.map((channel) => {
          const setting = byChannel[channel];
          if (!setting) return null;
          return (
            <SettingsChannelControl
              key={channel}
              setting={setting}
              namePrefix={`${event.id}-${channel}`}
              onEnabledChange={onEnabledChange}
              onPeriodChange={onPeriodChange}
              onTimeChange={onTimeChange}
            />
          );
        })}
      </div>
    </div>
  );
}
