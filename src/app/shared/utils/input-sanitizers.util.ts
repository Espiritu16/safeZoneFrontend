const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g;
const MULTIPLE_SPACES = /\s+/g;
const DIGITS = /[^0-9]/g;
const PERSON_NAME_CHARS = /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/g;
const CASE_CODE_CHARS = /[^A-Za-z0-9-]/g;

export function removeControlChars(value: string): string {
  return value.replace(CONTROL_CHARS, '');
}

export function normalizeText(value: string): string {
  return removeControlChars(value).trim().replace(MULTIPLE_SPACES, ' ');
}

export function sanitizeNumbersOnly(value: string): string {
  return removeControlChars(value).replace(DIGITS, '');
}

export function sanitizeLettersOnly(value: string): string {
  return removeControlChars(value).replace(PERSON_NAME_CHARS, '').replace(MULTIPLE_SPACES, ' ');
}

export function sanitizeCaseCode(value: string): string {
  return removeControlChars(value).replace(CASE_CODE_CHARS, '').toUpperCase();
}

export function clampInteger(value: string | number, min: number, max: number): number {
  const numeric = Number(sanitizeNumbersOnly(String(value)));
  if (!Number.isFinite(numeric)) {
    return min;
  }
  return Math.min(Math.max(numeric, min), max);
}
