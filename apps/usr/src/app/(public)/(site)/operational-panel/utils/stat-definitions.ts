import type { ComponentType } from 'react';

import {
  AdjustIcon,
  AdsClickIcon,
  BlockIcon,
  CancelIcon,
  CheckIcon,
  CommentIcon,
  CompareArrowsIcon,
  ConfirmationNumberIcon,
  DoneIcon,
  EditIcon,
  EmojiEventsIcon,
  ForumIcon,
  HeadsetMicIcon,
  LinkIcon,
  MoveToInboxIcon,
  ReplyIcon,
  ReportIcon,
  ShareIcon,
  SouthWestIcon,
  StarIcon,
  SupportAgentIcon,
  ThumbDownIcon,
  ThumbUpFilledIcon,
  ThumbUpIcon,
  TrendingUpIcon,
  VerifiedUserIcon,
  WorkspacePremiumIcon,
} from '@/components/icons/material-icons';

export type StatSectionId = 'account' | 'interactions' | 'comments' | 'notifications' | 'support' | 'referral';

export type StatCardDefinition = {
  id: string;
  kind: 'count' | 'ratio';
  icon: ComponentType<{ className?: string }>;
  /** Unit after the value. */
  unit?: 'minutes';
};

export type StatSectionDefinition = {
  id: StatSectionId;
  /** `notifications` = Notification MS statistics report (real API); everything else is mocked. */
  source: 'mock' | 'notifications';
  cards: StatCardDefinition[];
};

const count = (id: string, icon: StatCardDefinition['icon'], unit?: 'minutes'): StatCardDefinition => ({
  id,
  kind: 'count',
  icon,
  unit,
});
const ratio = (id: string, icon: StatCardDefinition['icon']): StatCardDefinition => ({ id, kind: 'ratio', icon });

/**
 * Card order = export reading order (start column first, then row by row). Labels:
 * `operationalPanel.stats.cards.<id>`; icons are the export's Material glyphs.
 */
export const STAT_SECTIONS: StatSectionDefinition[] = [
  {
    id: 'account',
    source: 'mock',
    cards: [
      count('editRequests', EditIcon),
      count('approvedRequests', DoneIcon),
      count('rejectedRequests', CancelIcon),
      count('adminResponseTime', ForumIcon, 'minutes'),
      count('privateFieldsCompleted', EditIcon),
      count('publicFieldsMoved', MoveToInboxIcon),
      ratio('rejectedRatio', CancelIcon),
      ratio('approvedRatio', CheckIcon),
    ],
  },
  {
    id: 'interactions',
    source: 'mock',
    cards: [
      count('interactionTargets', AdjustIcon),
      count('lowLikeTargets', ThumbUpFilledIcon),
      count('topInteractionType', ThumbUpIcon),
      count('averageScore', StarIcon),
      count('highLikeTargets', TrendingUpIcon),
      ratio('likePerView', ThumbUpIcon),
      ratio('lowScoreTargets', SouthWestIcon),
      ratio('fullScoreTargets', TrendingUpIcon),
      ratio('interactionsVsPrevious', CompareArrowsIcon),
      ratio('likedVsDisliked', CompareArrowsIcon),
      ratio('followVsUnfollow', CompareArrowsIcon),
    ],
  },
  {
    id: 'comments',
    source: 'mock',
    cards: [
      count('commentsSubmitted', CommentIcon),
      count('commentsReplied', ReplyIcon),
      count('commentsLiked', ThumbUpIcon),
      count('commentsDisliked', ThumbDownIcon),
      count('commentsInappropriate', BlockIcon),
      count('commentsReported', ReportIcon),
    ],
  },
  { id: 'notifications', source: 'notifications', cards: [] },
  {
    id: 'support',
    source: 'mock',
    cards: [
      count('ticketsAverage', ConfirmationNumberIcon),
      count('ticketResolutionTime', HeadsetMicIcon),
      count('operatorResponseTime', SupportAgentIcon, 'minutes'),
      count('adminReplyTime', SupportAgentIcon, 'minutes'),
    ],
  },
  {
    id: 'referral',
    source: 'mock',
    cards: [
      count('linksCreated', LinkIcon),
      count('linksShared', ShareIcon),
      count('linkClicks', AdsClickIcon),
      count('registrations', CheckIcon),
      count('upgradedRegistrations', VerifiedUserIcon),
      count('rewardsCreated', EmojiEventsIcon),
      count('maxRewards', EmojiEventsIcon),
      ratio('upgradedRatio', WorkspacePremiumIcon),
    ],
  },
];
