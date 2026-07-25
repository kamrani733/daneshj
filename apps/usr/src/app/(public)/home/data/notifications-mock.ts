export type NotificationStatus = 'unread' | 'read';

export type NotificationItem = {
  id: string;
  subject: string;
  body: string;
  date: string;
  time: string;
  status: NotificationStatus;
};

/** Temporary mock — replace with API later. */
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    subject: 'موضوع اعلان 1',
    body: 'متن اعلان در این فسمت آورده میشود ',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    status: 'unread',
  },
  {
    id: '2',
    subject: 'موضوع اعلان 1',
    body: 'متن اعلان در این فسمت آورده میشود ',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    status: 'unread',
  },
  {
    id: '3',
    subject: 'موضوع اعلان 1',
    body: 'متن اعلان در این فسمت آورده میشود ',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    status: 'read',
  },
  {
    id: '4',
    subject: 'موضوع اعلان 1',
    body: 'متن اعلان در این فسمت آورده میشود ',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    status: 'read',
  },
  {
    id: '5',
    subject: 'موضوع اعلان 1',
    body: 'متن اعلان در این فسمت آورده میشود ',
    date: '1404/12/06 ',
    time: '1:15ب ظ',
    status: 'read',
  },
];

export function countUnreadNotifications(items: NotificationItem[]) {
  return items.reduce((total, item) => (item.status === 'unread' ? total + 1 : total), 0);
}
