export type NotificationStatus = 'unread' | 'read';

export type NotificationRecord = {
  id: string;
  subject: string;
  body: string;
  date: string;
  time: string;
  status: NotificationStatus;
  kind: 'manual' | 'system';
  mainCategory: string;
  subCategory: string;
  link: string;
  readDate: string | null;
  readTime: string | null;
};
