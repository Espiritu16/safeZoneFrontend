/**
 * Utilidades de validación y sanitización para SafeZone Frontend.
 */

/**
 * Elimina espacios en blanco iniciales y finales, y colapsa múltiples espacios internos a uno solo.
 */
export function trimAndCollapse(val: string | null | undefined): string {
  if (!val) return '';
  return val.trim().replace(/\s+/g, ' ');
}

/**
 * Valida si un texto contiene únicamente letras, espacios, guion y apóstrofe.
 */
export function onlyLetters(val: string | null | undefined): boolean {
  if (!val) return false;
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/;
  return regex.test(val);
}

/**
 * Valida un correo electrónico bajo formato básico de RFC y límites de longitud.
 */
export function isValidEmail(val: string | null | undefined): boolean {
  if (!val) return false;
  const trimmed = val.trim();
  if (trimmed.length > 254) return false;

  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;
  if (parts[0].length > 64) return false;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

/**
 * Valida que un DNI tenga exactamente 8 dígitos numéricos.
 */
export function isValidDni(val: string | null | undefined): boolean {
  if (!val) return false;
  return /^\d{8}$/.test(val.trim());
}

/**
 * Valida que un celular tenga exactamente 9 dígitos numéricos.
 */
export function isValidCelular(val: string | null | undefined): boolean {
  if (!val) return false;
  return /^\d{9}$/.test(val.trim());
}

/**
 * Valida un código de seguimiento de caso (público).
 * Ejemplo: SZ-SUR-047, SZ-001-2026, etc.
 * Admite: 2-4 letras al inicio, un guion, y de 6 a 12 caracteres alfanuméricos.
 */
export function isValidTrackingCode(val: string | null | undefined): boolean {
  if (!val) return false;
  const regex = /^[A-Z]{2,4}-[A-Z0-9]{6,12}$/;
  return regex.test(val.trim().toUpperCase());
}

/**
 * Manejador de eventos keydown para bloquear cualquier tecla que no sea numérica o de control.
 * Previene el ingreso de 'e', 'E', '+', '-', '.', ',' en campos numéricos estrictos.
 */
export function blockNonNumericKeys(event: KeyboardEvent): void {
  // Permitir teclas de control: Backspace, Delete, Tab, Escape, Enter
  // Y combinaciones con Ctrl/Cmd (Copiar, pegar, seleccionar todo, etc.)
  if (
    [
      'Backspace',
      'Tab',
      'Delete',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End'
    ].includes(event.key) ||
    event.ctrlKey ||
    event.metaKey
  ) {
    return;
  }

  // Si no es un número del 0 al 9, bloquear
  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault();
  }
}

/**
 * Filtra un valor de texto eliminando cualquier carácter que no sea un número.
 * Útil para limpiar el texto ingresado tras un pegado (paste).
 */
export function filterNumericInput(val: string): string {
  if (!val) return '';
  return val.replace(/\D/g, '');
}
