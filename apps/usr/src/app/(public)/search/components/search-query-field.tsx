'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { SearchField } from '@/components/ui/search-field';
import { toFaDigits } from '@/lib/jalali';

import {
  SEARCH_QUERY_MAX_LENGTH,
  normalizeSearchQuery,
} from '@search/utils/search-params';

const DEBOUNCE_MS = 300;

type SearchQueryFieldProps = {
  /** Query from the URL. */
  value: string;
  /** Called 300 ms after typing stops, with the normalized query. */
  onDebouncedChange: (query: string) => void;
};

/** Figma «موضوع جستجو» pill — local draft, debounced into the URL. */
export function SearchQueryField({
  value,
  onDebouncedChange,
}: SearchQueryFieldProps) {
  const t = useTranslations('search');
  // The URL keeps Latin digits (sent to the API); the field shows Persian digits.
  const [draft, setDraft] = useState(() => toFaDigits(value));
  const lastSent = useRef(value);

  // URL changed from outside (header search, back button) → adopt it.
  useEffect(() => {
    if (value !== lastSent.current) {
      lastSent.current = value;
      setDraft(toFaDigits(value));
    }
  }, [value]);

  useEffect(() => {
    const normalized = normalizeSearchQuery(draft);
    if (normalized === lastSent.current) return;
    const timer = setTimeout(() => {
      lastSent.current = normalized;
      onDebouncedChange(normalized);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, onDebouncedChange]);

  return (
    <SearchField
      label={t('queryLabel')}
      placeholder={t('queryLabel')}
      size="xl"
      maxLength={SEARCH_QUERY_MAX_LENGTH}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onClear={() => setDraft('')}
      clearLabel={t('clearQuery')}
      containerClassName="w-full max-w-180"
    />
  );
}
