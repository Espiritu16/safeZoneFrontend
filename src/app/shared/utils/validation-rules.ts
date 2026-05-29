export const VALIDATION_PATTERNS = {
  DNI: /^[0-9]{8}$/,
  CELULAR: /^[0-9]{9}$/,
  NUMBERS_ONLY: /^[0-9]+$/,
  PERSON_NAME: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/,
  EMAIL_BASIC: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  INSTITUTIONAL_EMAIL: /^[a-zA-Z0-9._%+-]+@safezone\.gob\.pe$/,
  CASE_CODE: /^[A-Z]{2,4}-[A-Z0-9]{6,12}$/,
  TIME_24H: /^([01]\d|2[0-3]):[0-5]\d$/,
} as const;

export const VALIDATION_LIMITS = {
  DNI_LENGTH: 8,
  CELULAR_LENGTH: 9,
  NAME_MIN: 2,
  NAME_MAX: 120,
  PERSON_NAME_MAX: 80,
  USER_NAME_MIN: 4,
  USER_NAME_MAX: 120,
  EMAIL_MAX: 254,
  EMAIL_LOCAL_MAX: 64,
  AGE_MIN: 0,
  AGE_MAX: 120,
  ADDRESS_MAX: 200,
  LONG_TEXT_MIN: 20,
  LONG_TEXT_MAX: 2000,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 1000,
  NOTES_MAX: 500,
  SESSION_TIMEOUT_MIN: 5,
  SESSION_TIMEOUT_MAX: 120,
  LOGIN_ATTEMPTS_MIN: 1,
  LOGIN_ATTEMPTS_MAX: 10,
  AUDIT_RETENTION_MIN: 30,
  AUDIT_RETENTION_MAX: 365,
} as const;

export const VALIDATION_MESSAGES = {
  dni: 'El DNI debe tener 8 dígitos numéricos.',
  celular: 'El celular debe tener 9 dígitos numéricos.',
  nombre: 'Solo se permiten letras, espacios, apóstrofe y guion.',
  email: 'Ingrese un correo electrónico válido.',
  institutionalEmail: 'Debe usar un correo institucional @safezone.gob.pe.',
  required: 'Este campo es obligatorio.',
  age: 'La edad debe ser un número entero entre 0 y 120.',
  caseCode: 'El código debe tener el formato PD-ABC12345.',
} as const;

export function isValidBasicEmail(value: string): boolean {
  const trimmed = value.trim();
  const [localPart = ''] = trimmed.split('@');
  return (
    trimmed.length <= VALIDATION_LIMITS.EMAIL_MAX &&
    localPart.length <= VALIDATION_LIMITS.EMAIL_LOCAL_MAX &&
    VALIDATION_PATTERNS.EMAIL_BASIC.test(trimmed)
  );
}

export function isValidInstitutionalEmail(value: string): boolean {
  return isValidBasicEmail(value) && VALIDATION_PATTERNS.INSTITUTIONAL_EMAIL.test(value.trim());
}

export function isInRange(value: string | number, min: number, max: number): boolean {
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(numericValue) && numericValue >= min && numericValue <= max;
}
