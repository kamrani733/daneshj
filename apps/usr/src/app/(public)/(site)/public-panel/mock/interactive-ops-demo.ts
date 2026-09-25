import { MOCK_PUBLIC_PANEL } from '@public-panel/data/public-panel-mock';
import { MOCK_STATS_PEOPLE } from '@public-panel/data/stats-people';
import type {
  ActorQueryPayload,
  AverageScoreResult,
  FollowPayload,
  FollowResult,
  InteractiveCountResult,
  LikePayload,
  LikeResult,
  ScorePayload,
  SharePayload,
  ShareResult,
  TargetQueryPayload,
} from '@public-panel/types/api';
import { LIKE_STATUS } from '@public-panel/types/api';

type DemoCounts = {
  followers: number;
  following: number;
  likers: number;
  liked: number;
  dislikers: number;
  averageScore: number;
  scoreCount: number;
};

let counts: DemoCounts = createInitialCounts();

function createInitialCounts(): DemoCounts {
  return {
    followers: MOCK_PUBLIC_PANEL.stats.followers,
    following: MOCK_PUBLIC_PANEL.stats.following,
    likers: MOCK_PUBLIC_PANEL.stats.likers,
    liked: MOCK_PUBLIC_PANEL.stats.liked,
    dislikers: MOCK_PUBLIC_PANEL.engagement.thumbsDown,
    averageScore: 4.6,
    scoreCount: 132,
  };
}

export function resetDemoInteractiveOpsState(): void {
  counts = createInitialCounts();
}

function demoPeople() {
  return MOCK_STATS_PEOPLE.map((person) => ({
    id: person.id,
    actorId: Number.parseInt(person.id, 10) || 1,
    username: person.username,
    displayName: person.displayName,
    avatarSrc: person.avatarSrc,
  }));
}

function countResult(count: number): InteractiveCountResult {
  return {
    count,
    people: demoPeople(),
    message: null,
  };
}

export async function followEntity(payload: FollowPayload): Promise<FollowResult> {
  if (payload.isActive) {
    counts.followers += 1;
  } else if (counts.followers > 0) {
    counts.followers -= 1;
  }
  return { isActive: payload.isActive, message: null };
}

export async function getFollowers(
  _payload: TargetQueryPayload
): Promise<InteractiveCountResult> {
  return countResult(counts.followers);
}

export async function getFollowings(
  _payload: ActorQueryPayload
): Promise<InteractiveCountResult> {
  return countResult(counts.following);
}

export async function reactToEntity(payload: LikePayload): Promise<LikeResult> {
  if (payload.likeStatus === LIKE_STATUS.like) {
    counts.likers += 1;
  } else if (payload.likeStatus === LIKE_STATUS.dislike) {
    counts.dislikers += 1;
  }
  return { status: payload.likeStatus, message: null };
}

export async function getLikers(
  _payload: TargetQueryPayload
): Promise<InteractiveCountResult> {
  return countResult(counts.likers);
}

export async function getLikees(
  _payload: ActorQueryPayload
): Promise<InteractiveCountResult> {
  return countResult(counts.liked);
}

export async function getDislikers(
  _payload: TargetQueryPayload
): Promise<InteractiveCountResult> {
  return countResult(counts.dislikers);
}

export async function getDislikees(
  _payload: ActorQueryPayload
): Promise<InteractiveCountResult> {
  return countResult(counts.dislikers);
}

export async function submitScore(payload: ScorePayload): Promise<{
  score: number;
  message: string | null;
}> {
  const nextTotal = counts.averageScore * counts.scoreCount + payload.score;
  counts.scoreCount += 1;
  counts.averageScore = nextTotal / counts.scoreCount;
  return { score: payload.score, message: null };
}

export async function getAverageScore(_payload: {
  accessToken?: string | null;
  targetId: number;
  targetType: ScorePayload['targetType'];
}): Promise<AverageScoreResult> {
  return {
    average: counts.averageScore,
    count: counts.scoreCount,
    message: null,
  };
}

export async function shareEntity(_payload: SharePayload): Promise<ShareResult> {
  return { message: null };
}
