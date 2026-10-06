import type { PanelComment } from '@public-panel/types/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/** Inner quote card for transferred comments (Figma Qouted list). */
export function QuotedCommentBlock({ comment }: { comment: PanelComment }) {
  const name = comment.originalAuthorName ?? comment.authorName;
  const handle = comment.originalAuthorHandle ?? comment.authorHandle;

  return (
    <div className="w-full rounded-xl border border-primary bg-primary/10 p-4 dark:border-primary-100">
      <div className="flex flex-col items-stretch gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-10 shrink-0">
            {comment.authorAvatar && !comment.originalAuthorName ? (
              <AvatarImage src={comment.authorAvatar} alt={name} />
            ) : null}
            <AvatarFallback className="bg-neutral-600 text-xs font-bold text-white">
              {name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-app-filter-ink">
            {name} @{handle}
          </span>
        </div>
        <p className="w-full text-start text-sm leading-[1.5] text-app-filter-ink">
          {comment.body}
        </p>
      </div>
    </div>
  );
}
