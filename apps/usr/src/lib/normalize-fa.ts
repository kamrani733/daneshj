/**
 * Persian text normalization for search input and duplicate checks
 * (`.cursor/rules/60-rtl-persian.mdc` — Arabic ي/ك → Persian ی/ک, digits → Latin before the API).
 */
const ARABIC_LETTERS: Record<string, string> = {
  ي: 'ی',
  ى: 'ی',
  ك: 'ک',
};

const ARABIC_LETTER_PATTERN = /[يىك]/g;
const NON_LATIN_DIGIT_PATTERN = /[۰-۹٠-٩]/g;

/** Persian (۰–۹) and Arabic-Indic (٠–٩) digits → Latin 0–9. */
export function toLatinDigits(value: string): string {
  return value.replace(NON_LATIN_DIGIT_PATTERN, (digit) => {
    const code = digit.charCodeAt(0);
    // U+06F0 (Persian zero) or U+0660 (Arabic-Indic zero)
    const zero = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - zero);
  });
}

/** Persian letters, Latin digits, single spaces, trimmed. */
export function normalizeFaText(value: string): string {
  return toLatinDigits(
    value.replace(
      ARABIC_LETTER_PATTERN,
      (letter) => ARABIC_LETTERS[letter] ?? letter,
    ),
  )
    .replace(/\s+/g, ' ')
    .trim();
}
