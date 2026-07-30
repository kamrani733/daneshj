import { toRequestQuery } from '@daneshjoam/api-client';

import type {
  ChannelSettingState,
  NotificationChannel,
  ReceivePeriod,
} from '@notifications/data/settings-mock';
import {
  SETTINGS_CHANNELS,
  getEventIdByCategoryId,
} from '@notifications/data/settings-mock';

import type {
  ActorChannelSettingDto,
  ActorNotificationDto,
  ActorNotificationListData,
  ActorReceivePeriod,
  ActorSettingChannel,
  ActorSettingItem,
  ActorSettingsDto,
  ChartsBarPoint,
  ChartsDonutView,
  ChartsReportResult,
  DetailedStatusReportDto,
  DetailedStatusReportItem,
  DetailedStatusReportListData,
  DetailedStatusReportResult,
  GetChartsReportPayload,
  GetDetailedStatusReportPayload,
  ListNotificationsPayload,
  NotificationChartsDataDto,
  NotificationItem,
  NotificationListResult,
  NotificationType,
  ReportChannel,
  ReportPriority,
  UnreadCountData,
  UnreadCounts,
} from './types';
import { formatChartDateLabel } from '../lib/chart-period-range';
import { splitSentAt } from '../lib/format-notification-datetime';

function toNotificationType(value: string): NotificationType {
  return value === 'manual' ? 'manual' : 'system';
}

/** Map wire DTO → UI notification item. */
export function mapActorNotification(
  dto: ActorNotificationDto
): NotificationItem {
  const { date, time } = splitSentAt(dto.sent_at);
  return {
    id: String(dto.id),
    subject: dto.subject?.trim() || dto.main_category?.trim() || '',
    body: dto.content,
    date,
    time,
    status: dto.is_read ? 'read' : 'unread',
    kind: toNotificationType(String(dto.notification_type)),
    mainCategory: dto.main_category?.trim() || '—',
    subCategory: dto.sub_category?.trim() || '—',
    link: dto.link?.trim() || '',
    sentAt: dto.sent_at,
  };
}

/** Accept paginated example shape or raw array (OpenAPI schema mismatch). */
export function mapNotificationList(
  data: ActorNotificationListData | ActorNotificationDto[] | null,
  message: string | null
): NotificationListResult {
  if (Array.isArray(data)) {
    const items = data.map(mapActorNotification);
    return {
      items,
      count: items.length,
      totalPages: 1,
      currentPage: 1,
      unreadCounts: {
        manual: items.filter((i) => i.kind === 'manual' && i.status === 'unread')
          .length,
        system: items.filter((i) => i.kind === 'system' && i.status === 'unread')
          .length,
      },
      message,
    };
  }

  const results = data?.results ?? [];
  return {
    items: results.map(mapActorNotification),
    count: data?.count ?? results.length,
    totalPages: data?.total_pages ?? 1,
    currentPage: data?.current_page ?? 1,
    unreadCounts: {
      manual: data?.unread_counts?.manual_count ?? 0,
      system: data?.unread_counts?.system_count ?? 0,
    },
    message,
  };
}

export function mapUnreadCounts(data: UnreadCountData | null): UnreadCounts {
  if (typeof data === 'number' && Number.isFinite(data)) {
    return { total: data, manual: data, system: 0 };
  }
  if (!data || typeof data !== 'object') {
    return { total: 0, manual: 0, system: 0 };
  }
  const manual = Number(data.manual_count ?? data.manual ?? 0);
  const system = Number(data.system_count ?? data.system ?? 0);
  const total = Number(
    data.count ?? data.total ?? data.unread_count ?? manual + system
  );
  return {
    total: Number.isFinite(total) ? total : 0,
    manual: Number.isFinite(manual) ? manual : 0,
    system: Number.isFinite(system) ? system : 0,
  };
}

/** YAML query for /notification/actor-notifications/list */
export function toListNotificationsQuery(payload: ListNotificationsPayload) {
  return toRequestQuery({
    page: payload.page ?? 1,
    search: payload.search,
    type: payload.type,
    is_read:
      payload.isRead === undefined ? undefined : payload.isRead ? 'true' : 'false',
    start_date: payload.startDate,
    end_date: payload.endDate,
    main_category_id: payload.mainCategoryId,
    sub_category_id: payload.subCategoryId,
    ordering: payload.ordering,
  });
}

const REPORT_CHANNELS: ReportChannel[] = [
  'email',
  'site',
  'sms',
  'telegram',
  'whatsapp',
];

function toReportPriority(value: string): ReportPriority {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'high' || normalized === 'بالا') return 'high';
  if (normalized === 'medium' || normalized === 'متوسط') return 'medium';
  return 'low';
}

function toReportReadStatus(value: string): 'unread' | 'read' {
  const normalized = value.trim().toLowerCase();
  if (
    normalized === 'unread' ||
    normalized.includes('نخوانده') ||
    normalized.includes('خوانده نشده') ||
    normalized.includes('مشاهده نشده')
  ) {
    return 'unread';
  }
  return 'read';
}

function toReportChannels(value: string[] | string): ReportChannel[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  return raw
    .map((item) => item.trim().toLowerCase())
    .filter((item): item is ReportChannel =>
      REPORT_CHANNELS.includes(item as ReportChannel)
    );
}

export function mapDetailedStatusReportItem(
  dto: DetailedStatusReportDto
): DetailedStatusReportItem {
  const { date, time } = splitSentAt(dto.sent_at);
  return {
    id: String(dto.id),
    subject: dto.subject?.trim() || '',
    body: dto.content?.trim() || '',
    mainCategory: dto.main_category?.trim() || '—',
    subCategory: dto.sub_category?.trim() || '—',
    priority: toReportPriority(String(dto.priority ?? 'low')),
    sender: dto.username?.trim() || 'System',
    status: toReportReadStatus(String(dto.status ?? '')),
    channels: toReportChannels(dto.received_channel ?? []),
    sentAt: dto.sent_at,
    sentDate: date,
    sentTime: time,
  };
}

export function mapDetailedStatusReportList(
  data: DetailedStatusReportListData | DetailedStatusReportDto[] | null,
  message: string | null
): DetailedStatusReportResult {
  if (Array.isArray(data)) {
    const items = data.map(mapDetailedStatusReportItem);
    return {
      items,
      count: items.length,
      totalPages: 1,
      currentPage: 1,
      message,
    };
  }

  const results = data?.results ?? [];
  return {
    items: results.map(mapDetailedStatusReportItem),
    count: data?.count ?? results.length,
    totalPages: data?.total_pages ?? 1,
    currentPage: data?.current_page ?? 1,
    message,
  };
}

/** YAML query for /notification/report/detailed_status_report */
export function toDetailedStatusReportQuery(
  payload: GetDetailedStatusReportPayload
) {
  return toRequestQuery({
    page: payload.page ?? 1,
    search: payload.search,
    ordering: payload.ordering,
    channel: payload.channel,
    priority: payload.priority,
    status: payload.status,
    main_category_id: payload.mainCategoryId,
    sub_category_id: payload.subCategoryId,
    start_date: toDateTimeParam(payload.startDate, 'start'),
    end_date: toDateTimeParam(payload.endDate, 'end'),
  });
}

/** API expects date-time; accept `YYYY-MM-DD` from the Jalali picker. */
function toDateTimeParam(
  value: string | undefined,
  bound: 'start' | 'end'
): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return bound === 'start'
      ? `${trimmed}T00:00:00.000Z`
      : `${trimmed}T23:59:59.999Z`;
  }
  return trimmed;
}

/** YAML query for /notification/report/charts_report */
export function toChartsReportQuery(payload: GetChartsReportPayload) {
  return toRequestQuery({
    actor_type: payload.actorType,
    start_date: payload.startDate,
    end_date: payload.endDate,
  });
}

const CHART_PRIMARY = 'var(--color-chart-series-b)';
const CHART_TEAL = 'var(--color-chart-series-a)';
const CHART_OTHER = 'var(--color-chart-other)';

function toPrimaryOtherDonut(
  items: Array<{ label: string; value: number; percent?: number }>,
  primaryColor: string,
  mode: 'percent' | 'count'
): ChartsDonutView {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const primary = sorted[0];
  const rest = sorted.slice(1);
  const otherValue = rest.reduce((sum, item) => sum + item.value, 0);
  const total = Math.max(
    items.reduce((sum, item) => sum + item.value, 0),
    0.0001
  );

  if (!primary) {
    return {
      slices: [
        { key: 'primary', value: 0 },
        { key: 'other', value: 100 },
      ],
      centerPercent: 0,
      centerLabel: '—',
      primaryColor,
      otherColor: CHART_OTHER,
      legend: [],
      totalCount: 0,
    };
  }

  const primaryPercent =
    primary.percent ?? Math.round((primary.value / total) * 1000) / 10;
  const otherPercent =
    Math.round((otherValue / total) * 1000) / 10 ||
    Math.max(0, Math.round((100 - primaryPercent) * 10) / 10);

  return {
    slices: [
      { key: 'primary', value: Math.max(primary.value, 0.01) },
      { key: 'other', value: Math.max(otherValue, 0.01) },
    ],
    centerPercent: primaryPercent,
    centerLabel: primary.label,
    primaryColor,
    otherColor: CHART_OTHER,
    legend: [
      {
        label: primary.label,
        color: primaryColor,
        display:
          mode === 'percent'
            ? { kind: 'percent', value: primaryPercent }
            : { kind: 'count', value: Math.round(primary.value) },
      },
      {
        label: rest.length > 0 ? 'سایر' : '—',
        color: CHART_OTHER,
        display:
          mode === 'percent'
            ? { kind: 'percent', value: otherPercent }
            : { kind: 'count', value: Math.round(otherValue) },
      },
    ],
    totalCount: Math.round(total),
  };
}

/** Map YAML NotificationChartsData → UI chart models. */
export function mapChartsReport(
  data: NotificationChartsDataDto | null | undefined,
  message: string | null = null
): ChartsReportResult {
  const reactionTimeSeries: ChartsBarPoint[] = (
    data?.user_reaction_time_chart?.series ?? []
  ).map((point) => ({
    label: formatChartDateLabel(point.date),
    value: Math.round(point.average_reaction_time_seconds / 60),
  }));

  const conversionRateSeries: ChartsBarPoint[] = (
    data?.unread_to_read_conversion_rate_chart?.series ?? []
  ).map((point) => ({
    label: formatChartDateLabel(point.date),
    value: Math.round(point.conversion_rate * 10) / 10,
  }));

  const readSeries = data?.read_vs_unread_distribution_chart?.series ?? [];
  const readPoint =
    readSeries.find((item) => /خوانده\s*شده/.test(item.status_label)) ??
    readSeries[0];
  const unreadPoint =
    readSeries.find((item) => /خوانده\s*نشده/.test(item.status_label)) ??
    readSeries[1];

  const readVsUnread: ChartsDonutView = {
    slices: [
      { key: 'primary', value: Math.max(readPoint?.percentage ?? 0, 0.01) },
      { key: 'other', value: Math.max(unreadPoint?.percentage ?? 0, 0.01) },
    ],
    centerPercent: Math.round(readPoint?.percentage ?? 0),
    centerLabel: readPoint?.status_label ?? 'خوانده شده',
    primaryColor: CHART_TEAL,
    otherColor: CHART_OTHER,
    legend: [
      {
        label: readPoint?.status_label ?? 'خوانده شده',
        color: CHART_TEAL,
        display: {
          kind: 'percent',
          value: Math.round((readPoint?.percentage ?? 0) * 10) / 10,
        },
      },
      {
        label: unreadPoint?.status_label ?? 'خوانده نشده',
        color: CHART_OTHER,
        display: {
          kind: 'percent',
          value: Math.round((unreadPoint?.percentage ?? 0) * 10) / 10,
        },
      },
    ],
    totalCount: readSeries.reduce((sum, item) => sum + item.count, 0),
  };

  const categoryReadRate = toPrimaryOtherDonut(
    (data?.main_category_read_rate_chart?.series ?? []).map((item) => ({
      label: item.main_category_name || 'بدون دسته',
      value: item.read_percentage,
      percent: item.read_percentage,
    })),
    CHART_PRIMARY,
    'percent'
  );

  const receivedByCategory = toPrimaryOtherDonut(
    (data?.received_notifications_by_main_category_chart?.series ?? []).map(
      (item) => ({
        label: item.main_category_name || 'بدون دسته',
        value: item.count,
        percent: item.percentage,
      })
    ),
    CHART_TEAL,
    'count'
  );

  return {
    reactionTimeSeries,
    conversionRateSeries,
    readVsUnread,
    categoryReadRate,
    receivedByCategory,
    message,
  };
}

const UI_CHANNELS: NotificationChannel[] = [
  'sms',
  'email',
  'telegram',
  'whatsapp',
];

function toHhMmSs(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
  return trimmed;
}

function toHhMm(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{2}:\d{2})(?::\d{2})?$/);
  return match?.[1] ?? trimmed;
}

export function mapActorSettingsDto(dto: ActorSettingsDto): ActorSettingItem {
  return {
    id: dto.id,
    categoryId: dto.category.id,
    categoryTitle: dto.category.title,
    channels: dto.channels ?? [],
  };
}

/** Accept bare array (list) or envelope data array (create response). */
export function mapActorSettingsList(
  data: ActorSettingsDto[] | null | undefined
): ActorSettingItem[] {
  if (!Array.isArray(data)) return [];
  return data.map(mapActorSettingsDto);
}

export function mapChannelDtoToUiState(
  dto: ActorChannelSettingDto
): ChannelSettingState | null {
  if (!UI_CHANNELS.includes(dto.channel as NotificationChannel)) return null;
  const period = dto.receive_period ?? 'at_moment';
  const isOff = period === 'off' || dto.is_enabled === false;
  const receivePeriod: ReceivePeriod =
    period === 'specified_time' ? 'specified_time' : 'at_moment';
  return {
    channel: dto.channel as NotificationChannel,
    isEnabled: !isOff && dto.is_enabled !== false,
    receivePeriod,
    receiveTimeStart: toHhMm(dto.receive_time),
    receiveTimeEnd: null,
  };
}

/** Merge API actor-settings into UI event → channels map. */
export function mergeActorSettingsIntoEventStates(
  base: Record<string, ChannelSettingState[]>,
  items: ActorSettingItem[]
): Record<string, ChannelSettingState[]> {
  const next: Record<string, ChannelSettingState[]> = {};
  for (const [eventId, channels] of Object.entries(base)) {
    next[eventId] = channels.map((channel) => ({ ...channel }));
  }

  for (const item of items) {
    const eventId = getEventIdByCategoryId(item.categoryId);
    if (!eventId || !next[eventId]) continue;

    const byChannel = new Map(
      item.channels
        .map(mapChannelDtoToUiState)
        .filter((c): c is ChannelSettingState => c != null)
        .map((c) => [c.channel, c])
    );

    next[eventId] = SETTINGS_CHANNELS.map((channel) => {
      const fromApi = byChannel.get(channel);
      const fallback = next[eventId]!.find((c) => c.channel === channel)!;
      return fromApi ? { ...fromApi } : { ...fallback };
    });
  }

  return next;
}

/** Map one UI event channels → ActorChannelSettingRequest[]. */
export function toActorChannelSettingRequest(
  channels: ChannelSettingState[]
): ActorChannelSettingDto[] {
  return channels.map((channel) => {
    const receivePeriod: ActorReceivePeriod = !channel.isEnabled
      ? 'off'
      : channel.receivePeriod;
    return {
      channel: channel.channel as ActorSettingChannel,
      is_enabled: channel.isEnabled,
      receive_period: receivePeriod,
      receive_time:
        channel.isEnabled && channel.receivePeriod === 'specified_time'
          ? toHhMmSs(channel.receiveTimeStart)
          : null,
    };
  });
}
