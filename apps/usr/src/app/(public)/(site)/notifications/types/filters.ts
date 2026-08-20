export type NotificationFilterStatus = 'read' | 'unread';

export type NotificationsFilterValues = {
  sentStart: string;
  sentEnd: string;
  readStart: string;
  readEnd: string;
  statuses: NotificationFilterStatus[];
  categoryIds: string[];
};

export type FilterCategoryOption = {
  id: string;
  apiId?: number;
  labelKey: string;
  children?: FilterCategoryOption[];
};
