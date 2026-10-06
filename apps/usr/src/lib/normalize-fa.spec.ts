import { normalizeFaText, toLatinDigits } from '@/lib/normalize-fa';

describe('toLatinDigits', () => {
  it('converts Persian and Arabic-Indic digits', () => {
    expect(toLatinDigits('۱۲۳۰')).toBe('1230');
    expect(toLatinDigits('٤٥٦')).toBe('456');
  });

  it('keeps other characters', () => {
    expect(toLatinDigits('کد ۲۴ abc')).toBe('کد 24 abc');
  });
});

describe('normalizeFaText', () => {
  it('maps Arabic yeh and kaf to Persian', () => {
    expect(normalizeFaText('كافي شاپ')).toBe('کافی شاپ');
    expect(normalizeFaText('مدرسى')).toBe('مدرسی');
  });

  it('collapses whitespace and trims', () => {
    expect(normalizeFaText('  کافه   کتاب  ')).toBe('کافه کتاب');
  });

  it('keeps ZWNJ inside words', () => {
    expect(normalizeFaText('سرویس‌ها')).toBe('سرویس‌ها');
  });
});
