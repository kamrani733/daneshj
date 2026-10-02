import type { CommentSort, PanelComment } from '@public-panel/types/ui';

export function appendReply(
  comments: PanelComment[],
  commentId: string,
  reply: PanelComment,
): PanelComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return {
        ...comment,
        replies: [
          ...(comment.replies ?? []),
          { ...reply, replyToName: comment.authorName },
        ],
      };
    }
    if (comment.replies?.length) {
      return {
        ...comment,
        replies: appendReply(comment.replies, commentId, reply),
      };
    }
    return comment;
  });
}

export function filterAndSortComments(
  comments: PanelComment[],
  query: string,
  sort: CommentSort,
): PanelComment[] {
  const q = query.trim();
  const filtered = q
    ? comments.filter(
        (comment) =>
          comment.body.includes(q) ||
          comment.authorName.includes(q) ||
          comment.authorHandle.includes(q) ||
          comment.quoteNote?.includes(q) ||
          comment.originalAuthorName?.includes(q),
      )
    : comments;

  // `date` keeps the API order (newest first); the others sort descending.
  const sorted = [...filtered];
  if (sort === 'likes') sorted.sort((a, b) => b.likes - a.likes);
  if (sort === 'dislikes') sorted.sort((a, b) => b.dislikes - a.dislikes);
  if (sort === 'replies') {
    sorted.sort((a, b) => (b.replies?.length ?? 0) - (a.replies?.length ?? 0));
  }
  // Featured comments stay on top (Figma «برگزیدن یک دیدگاه»); order inside each group kept.
  return [
    ...sorted.filter((comment) => comment.featured),
    ...sorted.filter((comment) => !comment.featured),
  ];
}
