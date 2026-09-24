'use client';

import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const COMMENT_COMPOSER_MAX_LENGTH = 1500;

type CommentComposerLabels = {
  placeholder: string;
  submit: string;
  cancel: string;
  charCount: string;
};

type CommentComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  labels: CommentComposerLabels;
  maxLength?: number;
  onFocus?: () => void;
  className?: string;
};

export function CommentComposer({
  value,
  onChange,
  onSubmit,
  onCancel,
  labels,
  maxLength = COMMENT_COMPOSER_MAX_LENGTH,
  onFocus,
  className,
}: CommentComposerProps) {
  const [expanded, setExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSubmit = value.trim().length > 0;

  const handleCancel = () => {
    onCancel();
    setExpanded(false);
    textareaRef.current?.blur();
  };

  return (
    <div className={cn('flex min-w-0 flex-1 flex-col gap-3', className)}>
      <label className="relative block w-full">
        <span className="sr-only">{labels.placeholder}</span>
        <textarea
          ref={textareaRef}
          value={value}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => {
            setExpanded(true);
            onFocus?.();
          }}
          placeholder={labels.placeholder}
          rows={expanded ? 4 : 1}
          className={cn(
            'w-full resize-none rounded-medium bg-surface-container-lowest px-3 py-3',
            'text-start text-body-small font-medium text-on-surface',
            'placeholder:text-on-surface-variant focus-visible:outline-none',
            expanded
              ? 'h-[119px] border border-primary pb-8'
              : 'h-[55px] border border-outline-variant'
          )}
        />
        {expanded ? (
          <span className="pointer-events-none absolute bottom-3 end-3 text-label-small text-on-surface-variant">
            {labels.charCount}
          </span>
        ) : null}
      </label>

      {expanded ? (
        <div dir="ltr" className="flex items-center gap-3">
          <Button type="button" size="pillSm" disabled={!canSubmit} onClick={onSubmit}>
            {labels.submit}
          </Button>
          <Button type="button" variant="link" onClick={handleCancel} className="h-auto px-0">
            {labels.cancel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
