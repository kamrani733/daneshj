/** Same-origin `/api` rewrite is enough; do not require NEXT_PUBLIC_ACTOR_API_URL. */
export function canQueryActor() {
  return true;
}

export function canFetchVisitorProfile(actorId: number) {
  return canQueryActor() && actorId > 0;
}
