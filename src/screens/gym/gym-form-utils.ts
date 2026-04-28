export function numberToString(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return '';
  return String(value);
}

export function parseIntegerInput(text: string): number {
  if (text.length === 0) return 0;
  const parsed = parseInt(text, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function parseDecimalInput(text: string): number {
  if (text.length === 0) return 0;
  const normalized = text.replace(',', '.');
  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}
