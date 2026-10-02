export type StatsPeopleKind =
  | 'followers'
  | 'following'
  | 'likers'
  | 'liked'
  /** Admin only (UsrPb_DspIntr). */
  | 'dislikers';

export type StatsPerson = {
  id: string;
  actorId?: number;
  username: string;
  displayName: string;
  avatarSrc?: string;
  isFollowing?: boolean;
};
