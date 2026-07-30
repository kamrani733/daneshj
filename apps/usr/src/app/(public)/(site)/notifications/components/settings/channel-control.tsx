'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import type {
  ChannelSettingState,
  NotificationChannel,
  ReceivePeriod,
} from '@notifications/data/settings-mock';
import { formatFaNumber } from '@/lib/format-fa';
import { cn } from '@/lib/utils';

import { SettingsTimePicker } from './time-picker';

type SettingsChannelControlProps = {
  setting: ChannelSettingState;
  namePrefix: string;
  onEnabledChange: (channel: NotificationChannel, isEnabled: boolean) => void;
  onPeriodChange: (channel: NotificationChannel, period: ReceivePeriod) => void;
  onTimeChange: (
    channel: NotificationChannel,
    field: 'receiveTimeStart' | 'receiveTimeEnd',
    value: string
  ) => void;
};

const controlClass = cn(
  'size-4 shrink-0 border-home-filter-border bg-transparent',
  'accent-primary checked:border-primary',
  'dark:border-home-filter-muted dark:accent-primary'
);

function formatDisplayTime(value: string | null): {
  text: string;
  period: 'am' | 'pm';
} | null {
  if (!value?.trim()) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  const period = hour >= 12 ? 'pm' : 'am';
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  const faHour =
    formatFaNumber(hour12).length === 1
      ? `۰${formatFaNumber(hour12)}`
      : formatFaNumber(hour12);
  const faMinute =
    formatFaNumber(minute).length === 1
      ? `۰${formatFaNumber(minute)}`
      : formatFaNumber(minute);
  return { text: `${faHour}:${faMinute}`, period };
}

/** Figma Picking time-* — checkbox + radios; Figma time picker for start/end. */
export function SettingsChannelControl({
  setting,
  namePrefix,
  onEnabledChange,
  onPeriodChange,
  onTimeChange,
}: SettingsChannelControlProps) {
  const t = useTranslations('notifications.settings');
  const periodName = `period-${namePrefix}`;
  const showTime = setting.isEnabled && setting.receivePeriod === 'specified_time';

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <label className="flex cursor-pointer items-center justify-between gap-3">
        <span className="text-base font-bold leading-6 tracking-[0.0094em] text-home-filter-ink">
          {t(`channels.${setting.channel}`)}
        </span>
        <input
          type="checkbox"
          checked={setting.isEnabled}
          onChange={(event) =>
            onEnabledChange(setting.channel, event.target.checked)
          }
          className={cn(controlClass, 'rounded-[2px]')}
        />
      </label>

      <fieldset
        disabled={!setting.isEnabled}
        className={cn(
          'flex w-full flex-col gap-3',
          !setting.isEnabled && 'opacity-40'
        )}
      >
        <legend className="sr-only">{t('timingLegend')}</legend>
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-sm font-medium leading-5 tracking-[0.0071em] text-home-filter-muted">
            {t('timing.atMoment')}
          </span>
          <input
            type="radio"
            name={periodName}
            value="at_moment"
            checked={setting.receivePeriod === 'at_moment'}
            onChange={() => onPeriodChange(setting.channel, 'at_moment')}
            className={controlClass}
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-sm font-medium leading-5 tracking-[0.0071em] text-home-filter-muted">
            {t('timing.specifiedTime')}
          </span>
          <input
            type="radio"
            name={periodName}
            value="specified_time"
            checked={setting.receivePeriod === 'specified_time'}
            onChange={() => onPeriodChange(setting.channel, 'specified_time')}
            className={controlClass}
          />
        </label>
      </fieldset>

      {showTime ? (
        <div className="mt-1 flex w-full flex-col gap-3">
          <TimeField
            label={t('timing.startTime')}
            value={setting.receiveTimeStart}
            placeholder={t('timing.pickTime')}
            onChange={(value) =>
              onTimeChange(setting.channel, 'receiveTimeStart', value)
            }
          />
          <TimeField
            label={t('timing.endTime')}
            value={setting.receiveTimeEnd}
            placeholder={t('timing.pickTime')}
            onChange={(value) =>
              onTimeChange(setting.channel, 'receiveTimeEnd', value)
            }
          />
        </div>
      ) : null}
    </div>
  );
}

function TimeField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string | null;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations('notifications.settings.timePicker');
  const [open, setOpen] = useState(false);
  const display = formatDisplayTime(value);

  return (
    <>
      <div className="relative pt-2">
        <span className="absolute start-3 top-0 z-10 bg-home-search-fill px-1 text-xs leading-4 text-home-filter-muted">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-14 w-full items-center justify-between rounded-t-md border border-home-filter-border bg-transparent px-3 text-start text-base text-home-filter-ink dark:border-home-filter-muted"
        >
          <span className={cn(!display && 'text-home-filter-muted')}>
            {display == null
              ? placeholder
              : `${display.text} ${display.period === 'am' ? t('am') : t('pm')}`}
          </span>
        </button>
      </div>

      <SettingsTimePicker
        open={open}
        value={value}
        onOpenChange={setOpen}
        onConfirm={onChange}
      />
    </>
  );
}
