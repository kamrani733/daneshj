/** Persian locale number formatting (IRANSansXFaNum-friendly). */
export function formatFaNumber(value: number, fractionDigits = 0) {
  return value.toLocaleString('fa-IR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatToman(value: number) {
  return `${formatFaNumber(value)} تومان`;
}

export function formatFaRating(value: number) {
  return formatFaNumber(value, value % 1 === 0 ? 0 : 1);
}
