export type DocumentKind = 'pdf' | 'image' | 'other';

export type DocumentReviewDecision = 'approve' | 'reject' | null;

export type DocumentItemState = 'uploading' | 'error' | 'done' | 'review';

export type DocumentItemModel = {
  id: string;
  name: string;
  kind: DocumentKind;
  state: DocumentItemState;
  progress?: number;
  errorKey?: 'maxSize' | 'uploadFailed';
  decision?: DocumentReviewDecision;
};

export type DocumentSlot = 'resume' | 'portfolio' | 'academic';

export type DocumentDraft = DocumentItemModel & {
  file?: File;
  filePath?: string;
  slot?: DocumentSlot;
};
