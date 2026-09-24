import {
  addJalaliMonths,
  buildJalaliMonthGrid,
  formatAcademicDate,
  formatJalaliDisplay,
  isJalaliLeap,
  jalaliMonthLength,
  jalaliWeekdaySat0,
  parseIsoDate,
  toFaDigits,
  toGregorian,
  toIsoDate,
  toJalali,
} from '@/lib/jalali';

describe('toFaDigits', () => {
  it('replaces ASCII digits and leaves other characters', () => {
    expect(toFaDigits(1404)).toBe('۱۴۰۴');
    expect(toFaDigits('12a3')).toBe('۱۲a۳');
    expect(toFaDigits(0)).toBe('۰');
  });
});

describe('Jalali conversion', () => {
  it('maps Nowruz 1403 and the following new year', () => {
    expect(toJalali(2024, 3, 20)).toEqual({ year: 1403, month: 1, day: 1 });
    expect(toGregorian(1403, 1, 1)).toEqual({ year: 2024, month: 3, day: 20 });
    expect(toIsoDate({ year: 1403, month: 1, day: 1 })).toBe('2024-03-20');
    expect(toJalali(2025, 3, 21)).toEqual({ year: 1404, month: 1, day: 1 });
  });

  it('round-trips Gregorian leap day and the day before Nowruz', () => {
    for (const date of [
      [2024, 2, 29],
      [2024, 3, 19],
      [2000, 1, 1],
    ] as const) {
      const [year, month, day] = date;
      const jalali = toJalali(year, month, day);
      expect(toGregorian(jalali.year, jalali.month, jalali.day)).toEqual({
        year,
        month,
        day,
      });
    }
  });

  it('treats 1403 as leap (Esfand 30) and 1404 as common (Esfand 29)', () => {
    expect(isJalaliLeap(1403)).toBe(true);
    expect(jalaliMonthLength(1403, 12)).toBe(30);
    expect(toGregorian(1403, 12, 30)).toEqual({ year: 2025, month: 3, day: 20 });
    expect(isJalaliLeap(1404)).toBe(false);
    expect(jalaliMonthLength(1404, 12)).toBe(29);
    expect(jalaliMonthLength(1403, 1)).toBe(31);
    expect(jalaliMonthLength(1403, 7)).toBe(30);
  });
});

describe('addJalaliMonths', () => {
  it('clamps the day when the destination month is shorter', () => {
    expect(addJalaliMonths({ year: 1403, month: 1, day: 31 }, 6)).toEqual({
      year: 1403,
      month: 7,
      day: 30,
    });
    expect(addJalaliMonths({ year: 1404, month: 11, day: 30 }, 1)).toEqual({
      year: 1404,
      month: 12,
      day: 29,
    });
  });

  it('crosses the year boundary in both directions', () => {
    expect(addJalaliMonths({ year: 1403, month: 12, day: 15 }, 1)).toEqual({
      year: 1404,
      month: 1,
      day: 15,
    });
    expect(addJalaliMonths({ year: 1404, month: 1, day: 15 }, -1)).toEqual({
      year: 1403,
      month: 12,
      day: 15,
    });
  });
});

describe('parseIsoDate', () => {
  it('returns null for empty and impossible dates', () => {
    expect(parseIsoDate(null)).toBeNull();
    expect(parseIsoDate(undefined)).toBeNull();
    expect(parseIsoDate('')).toBeNull();
    expect(parseIsoDate('   ')).toBeNull();
    expect(parseIsoDate('not-a-date')).toBeNull();
    expect(parseIsoDate('2024-13-01')).toBeNull();
    expect(parseIsoDate('2024-00-10')).toBeNull();
    expect(parseIsoDate('2024-01-32')).toBeNull();
  });

  it('converts a Gregorian ISO day to Jalali', () => {
    expect(parseIsoDate('2024-03-20')).toEqual({ year: 1403, month: 1, day: 1 });
  });
});

describe('formatJalaliDisplay and formatAcademicDate', () => {
  it('renders a zero-padded Persian date', () => {
    expect(formatJalaliDisplay({ year: 1404, month: 8, day: 17 })).toBe('۱۴۰۴/۰۸/۱۷');
  });

  it('formats ISO dates and leaves unparsable text', () => {
    expect(formatAcademicDate('2024-03-20')).toBe('۱۴۰۳/۰۱/۰۱');
    expect(formatAcademicDate('2024-03-20T12:00:00')).toBe('۱۴۰۳/۰۱/۰۱');
    expect(formatAcademicDate('')).toBe('');
    expect(formatAcademicDate(null)).toBe('');
    expect(formatAcademicDate('not-a-date')).toBe('not-a-date');
  });
});

describe('calendar grid', () => {
  it('starts Saturday-aligned and covers six weeks', () => {
    expect(jalaliWeekdaySat0({ year: 1403, month: 1, day: 1 })).toBe(4);
    const grid = buildJalaliMonthGrid(1403, 1);
    expect(grid).toHaveLength(42);
    expect(grid.filter((cell) => cell.inCurrentMonth)).toHaveLength(31);
    expect(grid[0]).toEqual({
      jalali: { year: 1402, month: 12, day: 26 },
      inCurrentMonth: false,
      iso: '2024-03-16',
    });
    expect(grid.find((cell) => cell.inCurrentMonth && cell.jalali.day === 1)?.iso).toBe(
      '2024-03-20'
    );
  });
});
