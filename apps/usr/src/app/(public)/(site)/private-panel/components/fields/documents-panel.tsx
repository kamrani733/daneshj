'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import {
  DocumentItem,
  type DocumentItemModel,
  type DocumentKind,
  type DocumentReviewDecision,
} from './document-item';
import { UploadDropzone } from './upload-dropzone';

const MAX_BYTES = 1 * 1024 * 1024;
const MAX_FILES = 5;

type DocumentsPanelProps = {
  dropLabel: string;
  dropOrLabel: string;
  uploadLabel: string;
  reviewMode?: boolean;
  wide?: boolean;
  className?: string;
};

function detectKind(file: File): DocumentKind {
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) return 'pdf';
  if (file.type.startsWith('image/') || /\.(jpe?g|png|gif|webp)$/i.test(file.name)) {
    return 'image';
  }
  return 'other';
}

export function DocumentsPanel({
  dropLabel,
  dropOrLabel,
  uploadLabel,
  reviewMode = false,
  wide = false,
  className,
}: DocumentsPanelProps) {
  const [items, setItems] = useState<DocumentItemModel[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const map = timers.current;
    return () => {
      for (const id of map.values()) window.clearInterval(id);
      map.clear();
    };
  }, []);

  const clearTimer = (id: string) => {
    const handle = timers.current.get(id);
    if (handle != null) {
      window.clearInterval(handle);
      timers.current.delete(id);
    }
  };

  const simulateUpload = useCallback((id: string) => {
    clearTimer(id);
    const handle = window.setInterval(() => {
      setItems((prev) => {
        const current = prev.find((item) => item.id === id);
        if (!current || current.state !== 'uploading') {
          clearTimer(id);
          return prev;
        }
        const next = Math.min(100, (current.progress ?? 0) + 12);
        if (next >= 100) {
          clearTimer(id);
          return prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  progress: 100,
                  state: reviewMode ? 'review' : 'done',
                  decision: reviewMode ? null : item.decision,
                }
              : item
          );
        }
        return prev.map((item) =>
          item.id === id ? { ...item, progress: next } : item
        );
      });
    }, 180);
    timers.current.set(id, handle);
  }, [reviewMode]);

  const onFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    setItems((prev) => {
      const room = Math.max(0, MAX_FILES - prev.length);
      const accepted = list.slice(0, room);
      const nextItems = [...prev];

      for (const file of accepted) {
        const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`;
        const kind = detectKind(file);
        if (file.size > MAX_BYTES) {
          nextItems.push({
            id,
            name: file.name,
            kind,
            state: 'error',
            progress: 28,
            errorKey: 'maxSize',
          });
          continue;
        }
        nextItems.push({
          id,
          name: file.name,
          kind,
          state: 'uploading',
          progress: 8,
        });
        queueMicrotask(() => simulateUpload(id));
      }

      return nextItems;
    });
  };

  const onCancel = (id: string) => {
    clearTimer(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onRemove = (id: string) => {
    clearTimer(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onDecisionChange = (id: string, decision: DocumentReviewDecision) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, decision } : item))
    );
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 min-[720px]:flex-row min-[720px]:items-start min-[720px]:justify-between',
        className
      )}
    >
      {items.length > 0 ? (
        <ul className="flex w-full flex-col gap-3 min-[720px]:max-w-[462px]">
          {items.map((item) => (
            <li key={item.id}>
              <DocumentItem
                item={item}
                onCancel={onCancel}
                onRemove={onRemove}
                onDecisionChange={onDecisionChange}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {items.length < MAX_FILES ? (
        <UploadDropzone
          label={dropLabel}
          orLabel={dropOrLabel}
          actionLabel={uploadLabel}
          wide={wide}
          onFiles={onFiles}
        />
      ) : null}
    </div>
  );
}
