'use client';

import { CloudUpload } from 'lucide-react';
import { useRef, type ChangeEvent, type DragEvent } from 'react';

import { UploadButton } from '@/components/ui/upload-button';
import { cn } from '@/lib/utils';

type UploadDropzoneProps = {
  label: string;
  orLabel: string;
  actionLabel: string;
  accept?: string;
  disabled?: boolean;
  wide?: boolean;
  onFiles?: (files: FileList | File[]) => void;
};

export function UploadDropzone({
  label,
  orLabel,
  actionLabel,
  accept = 'application/pdf,image/jpeg,image/png',
  disabled,
  wide = false,
  onFiles,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length || disabled) return;
    onFiles?.(files);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex min-h-[220px] w-full flex-col items-center justify-center gap-1 rounded-2xl',
        'border border-dashed border-[#bfc9c1] px-4 py-8',
        'bg-transparent dark:border-auth-input-border dark:bg-app-search-category/40',
        disabled && 'pointer-events-none opacity-50',
        wide
          ? 'min-[720px]:max-w-[462px]'
          : 'min-[720px]:min-w-[240px] min-[720px]:max-w-[320px]'
      )}
    >
      <CloudUpload
        className="size-12 text-[#404943] dark:text-app-filter-muted"
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="text-center text-xs font-medium text-[#404943] dark:text-app-filter-muted">
        {label}
      </p>
      <p className="text-center text-xs font-medium text-[#404943] dark:text-app-filter-muted">
        {orLabel}
      </p>
      <UploadButton
        className="mt-1"
        onClick={(event) => {
          event.stopPropagation();
          inputRef.current?.click();
        }}
      >
        {actionLabel}
      </UploadButton>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={onInputChange}
      />
    </div>
  );
}
