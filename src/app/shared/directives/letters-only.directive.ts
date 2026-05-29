import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { sanitizeLettersOnly } from '../utils/input-sanitizers.util';

const ALLOWED_CONTROL_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
]);

@Directive({
  selector: '[appLettersOnly]',
  standalone: true,
})
export class LettersOnlyDirective {
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey || event.altKey || ALLOWED_CONTROL_KEYS.has(event.key)) {
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    this.syncSanitizedValue(event.target as HTMLInputElement);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const pasted = event.clipboardData?.getData('text') ?? '';
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = input.value.slice(0, start) + sanitizeLettersOnly(pasted) + input.value.slice(end);
    this.syncSanitizedValue(input);
  }

  private syncSanitizedValue(input: HTMLInputElement) {
    const sanitized = sanitizeLettersOnly(input.value);
    if (input.value !== sanitized) {
      input.value = sanitized;
    }
    if (this.ngControl?.control?.value !== sanitized) {
      this.ngControl?.control?.setValue(sanitized);
    }
  }
}
