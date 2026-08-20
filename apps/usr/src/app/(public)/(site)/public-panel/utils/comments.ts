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

  const sorted = [...filtered];
  if (sort === 'oldest') sorted.reverse();
  if (sort === 'mostLiked') {
    sorted.sort((a, b) => b.likes - a.likes);
  }
  return sorted;
}
