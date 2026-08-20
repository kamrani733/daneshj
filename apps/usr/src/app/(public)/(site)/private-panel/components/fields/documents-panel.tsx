'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import {
  DocumentItem,
} from './document-item';
import type {
  DocumentDraft,
  DocumentKind,
  DocumentReviewDecision,
} from '@private-panel/types/documents';
import { UploadDropzone } from './upload-dropzone';

const MAX_BYTES = 1 * 1024 * 1024;
const MAX_FILES = 5;

type DocumentsPanelProps = {
  dropLabel: string;
  dropOrLabel: string;
  uploadLabel: string;
  reviewMode?: boolean;
  wide?: boolean;
  showDropzone?: boolean;
  className?: string;
  documents: DocumentDraft[];
  onDocumentsChange: (documents: DocumentDraft[]) => void;
  onUploadFile?: (file: File) => Promise<string>;
};

function detectKind(file: File): DocumentKind {
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) return 'pdf';
  if (
    file.type.startsWith('image/') ||
    /\.(jpe?g|png|gif|webp)$/i.test(file.name)
  ) {
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
  showDropzone = true,
  className,
  documents,
  onDocumentsChange,
  onUploadFile,
}: DocumentsPanelProps) {
  const documentsRef = useRef(documents);
  documentsRef.current = documents;

  useEffect(() => {
    return () => {
      /* no timers to clear when using real/async upload */
    };
  }, []);

  const patchDocument = (id: string, patch: Partial<DocumentDraft>) => {
    onDocumentsChange(
      documentsRef.current.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      )
    );
  };

  const onFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    const room = Math.max(0, MAX_FILES - documents.length);
    const accepted = list.slice(0, room);
    if (accepted.length === 0) return;

    const nextItems = [...documents];
    const queued: Array<DocumentDraft & { file: File }> = [];

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
          file,
        });
        continue;
      }
      const draft: DocumentDraft & { file: File } = {
        id,
        name: file.name,
        kind,
        state: 'uploading',
        progress: 12,
        file,
      };
      nextItems.push(draft);
      queued.push(draft);
    }

    onDocumentsChange(nextItems);

    for (const draft of queued) {
      void (async () => {
        try {
          if (onUploadFile) {
            const filePath = await onUploadFile(draft.file);
            patchDocument(draft.id, {
              progress: 100,
              state: reviewMode ? 'review' : 'done',
              filePath,
              decision: reviewMode ? null : draft.decision,
            });
            return;
          }

          let progress = 12;
          while (progress < 100) {
            await new Promise((resolve) => window.setTimeout(resolve, 120));
            progress = Math.min(100, progress + 18);
            patchDocument(draft.id, { progress });
          }
          patchDocument(draft.id, {
            progress: 100,
            state: reviewMode ? 'review' : 'done',
            decision: reviewMode ? null : draft.decision,
          });
        } catch {
          patchDocument(draft.id, {
            state: 'error',
            progress: 40,
            errorKey: 'uploadFailed',
          });
        }
      })();
    }
  };

  const onCancel = (id: string) => {
    onDocumentsChange(documents.filter((item) => item.id !== id));
  };

  const onRemove = (id: string) => {
    onDocumentsChange(documents.filter((item) => item.id !== id));
  };

  const onDecisionChange = (id: string, decision: DocumentReviewDecision) => {
    onDocumentsChange(
      documents.map((item) => (item.id === id ? { ...item, decision } : item))
    );
  };

  return (
    <div
      dir="rtl"
      className={cn(
        'flex w-full flex-col items-stretch gap-4',
        'min-[720px]:flex-row min-[720px]:items-start min-[720px]:justify-between',
        className
      )}
    >
      {documents.length > 0 ? (
        <ul className="flex w-full flex-1 flex-col gap-3 min-[720px]:max-w-[462px]">
          {documents.map((item) => (
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

      {showDropzone && documents.length < MAX_FILES ? (
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
