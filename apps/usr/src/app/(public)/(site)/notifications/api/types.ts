/** Wire + app types for Notification Microservice (actor notifications). */

export interface ApiResponse<T> {
  data: T | null;
  message: string | null;
  status_code: number;
  errors: Record<string, string>;
  success: boolean;
}

export type NotificationType = 'manual' | 'system';

export type NotificationOrdering =
  | 'created_at'
  | '-created_at'
  | 'is_read'
  | '-is_read';

/** YAML: ActorLastFiveNotification / ActorNotificationList */
export interface ActorNotificationDto {
  id: number;
  subject: string | null;
  main_category: string | null;
  sub_category: string | null;
  notification_type: NotificationType | string;
  sent_at: string | null;
  content: string;
  link: string | null;
  is_read: boolean;
}

/** YAML example for list — paginated envelope (schema incorrectly types data as array). */
export interface ActorNotificationListData {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: ActorNotificationDto[];
  unread_counts: {
    manual_count: number;
    system_count: number;
  };
}

/** YAML: MarkNotificationAsRead */
export interface MarkNotificationAsReadData {
  actor_id: number;
  notification_id: string | number;
  read_at: string;
}

/** Best-effort unread-count payload (OpenAPI response schema is incomplete). */
export type UnreadCountData =
  | number
  | {
      count?: number;
      total?: number;
      unread_count?: number;
      manual_count?: number;
      system_count?: number;
      manual?: number;
      system?: number;
    };

/** App-facing notification (bell popover + shared UI). */
export interface NotificationItem {
  id: string;
  subject: string;
  body: string;
  date: string;
  time: string;
  status: 'unread' | 'read';
  kind: NotificationType;
  mainCategory: string;
  subCategory: string;
  link: string;
  sentAt: string | null;
}

export interface NotificationListResult {
  items: NotificationItem[];
  count: number;
  totalPages: number;
  currentPage: number;
  unreadCounts: {
    manual: number;
    system: number;
  };
  message: string | null;
}

export interface UnreadCounts {
  total: number;
  manual: number;
  system: number;
}

export interface GetLast5NotificationsPayload {
  accessToken: string;
}

export interface ListNotificationsPayload {
  accessToken: string;
  page?: number;
  search?: string;
  type?: NotificationType;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  mainCategoryId?: number;
  subCategoryId?: number;
  ordering?: NotificationOrdering;
}

export interface MarkNotificationAsReadPayload {
  accessToken: string;
  sentNotificationId: number | string;
}

export interface MarkAllNotificationsAsReadPayload {
  accessToken: string;
}

export interface MarkLast5NotificationsAsReadPayload {
  accessToken: string;
}

export interface GetUnreadCountPayload {
  accessToken: string;
}

/** YAML query enums for detailed_status_report */
export type ReportChannel = 'email' | 'site' | 'sms' | 'telegram' | 'whatsapp';
export type ReportPriority = 'high' | 'low' | 'medium';
export type ReportReadStatus = 'read' | 'unread';
export type ReportOrdering =
  | 'main_category'
  | '-main_category'
  | 'priority'
  | '-priority'
  | 'sent_at'
  | '-sent_at'
  | 'status'
  | '-status'
  | 'sub_category'
  | '-sub_category';

/** YAML: NotificationDetailedStatusReport */
export interface DetailedStatusReportDto {
  id: number;
  content: string;
  main_category: string;
  sub_category: string;
  subject: string;
  priority: string;
  username: string;
  staff_id?: number;
  received_channel: string[] | string;
  status: string;
  sent_at: string;
}

/** Example envelope for detailed_status_report (schema types data as array). */
export interface DetailedStatusReportListData {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: DetailedStatusReportDto[];
}

export interface DetailedStatusReportItem {
  id: string;
  subject: string;
  body: string;
  mainCategory: string;
  subCategory: string;
  priority: ReportPriority;
  sender: string;
  status: 'unread' | 'read';
  channels: ReportChannel[];
  sentAt: string | null;
  sentDate: string;
  sentTime: string;
}

export interface DetailedStatusReportResult {
  items: DetailedStatusReportItem[];
  count: number;
  totalPages: number;
  currentPage: number;
  message: string | null;
}

export interface GetDetailedStatusReportPayload {
  accessToken: string;
  page?: number;
  search?: string;
  ordering?: ReportOrdering;
  channel?: ReportChannel;
  priority?: ReportPriority;
  status?: ReportReadStatus;
  mainCategoryId?: number;
  subCategoryId?: number;
  startDate?: string;
  endDate?: string;
}

/** YAML: ActorChannelSetting channel enum */
export type ActorSettingChannel =
  | 'site'
  | 'email'
  | 'sms'
  | 'telegram'
  | 'whatsapp';

/** YAML: ActorChannelSetting.receive_period */
export type ActorReceivePeriod = 'at_moment' | 'specified_time' | 'off';

/** YAML: ActorChannelSetting / ActorChannelSettingRequest */
export interface ActorChannelSettingDto {
  channel: ActorSettingChannel;
  is_enabled?: boolean;
  receive_period?: ActorReceivePeriod;
  receive_time?: string | null;
}

/** YAML: Category (nested in ActorSettings) */
export interface NotificationCategoryDto {
  id: number;
  title: string;
  parent?: number | null;
}

/** YAML: ActorSettings */
export interface ActorSettingsDto {
  id: number;
  category: NotificationCategoryDto;
  channels: ActorChannelSettingDto[];
}

/** YAML: ActorSettingRequestRequest */
export interface ActorSettingRequestBody {
  category: number;
  channels: ActorChannelSettingDto[];
}

/** YAML: ActorSettingsResponse */
export interface ActorSettingsResponseData {
  data: ActorSettingsDto[] | null;
  message: string | null;
  status_code: number;
  errors: Record<string, string>;
  success: boolean;
}

export interface GetActorSettingsPayload {
  accessToken: string;
}

export interface ApplyActorSettingPayload {
  accessToken: string;
  categoryId: number;
  channels: ActorChannelSettingDto[];
}

export interface ApplyActorSettingsPayload {
  accessToken: string;
  settings: Array<{
    categoryId: number;
    channels: ActorChannelSettingDto[];
  }>;
}

/** App-facing actor setting row (one category / event). */
export interface ActorSettingItem {
  id: number;
  categoryId: number;
  categoryTitle: string;
  channels: ActorChannelSettingDto[];
}

/** YAML: UserReactionTimePoint */
export interface UserReactionTimePointDto {
  date: string;
  average_reaction_time_seconds: number;
  average_reaction_time_formatted: string;
}

/** YAML: UserReactionTimeChart */
export interface UserReactionTimeChartDto {
  chart_type?: string;
  series: UserReactionTimePointDto[];
}

/** YAML: MainCategoryReadRatePoint */
export interface MainCategoryReadRatePointDto {
  main_category_id: number | null;
  main_category_name: string;
  read_percentage: number;
}

/** YAML: MainCategoryReadRateChart */
export interface MainCategoryReadRateChartDto {
  chart_type?: string;
  series: MainCategoryReadRatePointDto[];
}

/** YAML: UnreadToReadConversionPoint */
export interface UnreadToReadConversionPointDto {
  date: string;
  conversion_rate: number;
}

/** YAML: UnreadToReadConversionChart */
export interface UnreadToReadConversionChartDto {
  chart_type?: string;
  series: UnreadToReadConversionPointDto[];
}

/** YAML: ReadVsUnreadDistributionPoint */
export interface ReadVsUnreadDistributionPointDto {
  status_label: string;
  count: number;
  percentage: number;
}

/** YAML: ReadVsUnreadDistributionChart */
export interface ReadVsUnreadDistributionChartDto {
  chart_type?: string;
  series: ReadVsUnreadDistributionPointDto[];
}

/** YAML: ReceivedNotificationsByMainCategoryPoint */
export interface ReceivedByCategoryPointDto {
  main_category_id: number | null;
  main_category_name: string;
  count: number;
  percentage: number;
}

/** YAML: ReceivedNotificationsByMainCategoryChart */
export interface ReceivedByCategoryChartDto {
  chart_type?: string;
  series: ReceivedByCategoryPointDto[];
}

/** YAML: NotificationChartsData */
export interface NotificationChartsDataDto {
  user_reaction_time_chart: UserReactionTimeChartDto;
  main_category_read_rate_chart: MainCategoryReadRateChartDto;
  unread_to_read_conversion_rate_chart: UnreadToReadConversionChartDto;
  read_vs_unread_distribution_chart: ReadVsUnreadDistributionChartDto;
  received_notifications_by_main_category_chart: ReceivedByCategoryChartDto;
}

export type ChartsReportActorType =
  | 'user'
  | 'admin'
  | 'business'
  | 'university'
  | 'industry'
  | 'organizer'
  | 'all';

export interface GetChartsReportPayload {
  accessToken: string;
  actorType?: ChartsReportActorType | string;
  startDate?: string;
  endDate?: string;
}

export type ChartsBarPoint = {
  label: string;
  value: number;
};

export type ChartsDonutSlice = {
  key: 'primary' | 'other';
  value: number;
};

export type ChartsDonutLegendItem = {
  label: string;
  color: string;
  display:
    | { kind: 'percent'; value: number }
    | { kind: 'count'; value: number };
};

export type ChartsDonutView = {
  slices: ChartsDonutSlice[];
  centerPercent: number;
  centerLabel: string;
  primaryColor: string;
  otherColor: string;
  legend: ChartsDonutLegendItem[];
  totalCount: number;
};

/** App-facing charts report for UI. */
export interface ChartsReportResult {
  reactionTimeSeries: ChartsBarPoint[];
  conversionRateSeries: ChartsBarPoint[];
  readVsUnread: ChartsDonutView;
  categoryReadRate: ChartsDonutView;
  receivedByCategory: ChartsDonutView;
  message: string | null;
}
