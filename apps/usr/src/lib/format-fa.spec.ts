import { formatFaNumber, formatFaRating, formatToman } from '@/lib/format-fa';

describe('formatFaNumber', () => {
  it('uses Persian digits and grouping', () => {
    expect(formatFaNumber(1234567)).toBe('۱٬۲۳۴٬۵۶۷');
    expect(formatFaNumber(0)).toBe('۰');
  });

  it('keeps the requested fraction digits', () => {
    expect(formatFaNumber(1200.5, 1)).toBe('۱٬۲۰۰٫۵');
    expect(formatFaNumber(1.2, 0)).toBe('۱');
  });
});

describe('formatToman', () => {
  it('appends the toman unit to a grouped Persian number', () => {
    expect(formatToman(25000)).toBe('۲۵٬۰۰۰ تومان');
  });
});

describe('formatFaRating', () => {
  it('omits a fraction for whole numbers and keeps one digit otherwise', () => {
    expect(formatFaRating(4)).toBe('۴');
    expect(formatFaRating(4.5)).toBe('۴٫۵');
    expect(formatFaRating(4.25)).toBe('۴٫۳');
  });
});
