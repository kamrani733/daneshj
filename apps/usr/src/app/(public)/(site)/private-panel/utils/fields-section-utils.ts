import type { VisibilityField } from '@private-panel/data/visibility-config';
import type { DocumentDraft } from '@private-panel/types/documents';

export type FieldsMode = 'view' | 'review';
export type ReviewDecision = 'approve' | 'reject';
export type FieldValues = Record<string, string>;
export type ReadyDocument = DocumentDraft & { filePath: string };

export function readyDocuments(docs: DocumentDraft[]): ReadyDocument[] {
  return docs.flatMap((doc) => {
    const filePath = doc.filePath;
    if ((doc.state === 'done' || doc.state === 'review') && filePath) {
      return [{ ...doc, filePath }];
    }
    return [];
  });
}

export function documentsSignature(docs: DocumentDraft[]): string {
  return readyDocuments(docs)
    .map((doc) => `${doc.id}:${doc.filePath}`)
    .sort()
    .join('|');
}

export function valuesFromFields(fields: VisibilityField[]): FieldValues {
  return Object.fromEntries(
    fields.map((field) => [field.id, field.imageSrc || field.value || '']),
  );
}

export function resetDependentLocationValues(
  values: FieldValues,
  changedId: string,
): FieldValues {
  const next = { ...values };

  const resets: Record<string, string[]> = {
    country: ['province', 'city', 'district'],
    province: ['city', 'district'],
    city: ['district'],
    eduCountry: ['eduProvince', 'eduCity', 'eduDistrict'],
    eduProvince: ['eduCity', 'eduDistrict'],
    eduCity: ['eduDistrict'],
  };

  for (const id of resets[changedId] ?? []) {
    next[id] = '';
  }

  return next;
}
