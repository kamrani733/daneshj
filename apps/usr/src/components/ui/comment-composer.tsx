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
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
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
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  onFocus,
  className,
}: CommentComposerProps) {
  const [expandedUncontrolled, setExpandedUncontrolled] = useState(defaultExpanded);
  const expanded = expandedProp ?? expandedUncontrolled;
  const setExpanded = (next: boolean) => {
    onExpandedChange?.(next);
    if (expandedProp === undefined) {
      setExpandedUncontrolled(next);
    }
  };

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
            'w-full resize-none rounded-medium px-3 py-3 shadow-app-elevation-2',
            'text-start font-medium text-on-surface',
            'placeholder:text-outline focus-visible:outline-none',
            'bg-on-primary',
            expanded
              ? 'min-h-[120px] border border-primary pb-8 text-label-large'
              : 'min-h-14 border border-outline-variant text-label-medium'
          )}
        />
        {expanded ? (
          <span className="pointer-events-none absolute bottom-3 end-3 text-label-small text-outline">
            {labels.charCount}
          </span>
        ) : null}
      </label>

      {expanded ? (
        <div dir="ltr" className="flex items-center gap-2">
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
