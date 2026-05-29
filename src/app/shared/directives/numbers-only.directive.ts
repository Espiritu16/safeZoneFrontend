import { Directive, HostBinding, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { sanitizeNumbersOnly } from '../utils/input-sanitizers.util';

const ALLOWED_CONTROL_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
]);

@Directive({
  selector: '[appNumbersOnly]',
  standalone: true,
})
export class NumbersOnlyDirective {
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  @HostBinding('attr.inputmode') inputMode = 'numeric';
  @HostBinding('attr.autocomplete') autocomplete = 'off';

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey || event.altKey || ALLOWED_CONTROL_KEYS.has(event.key)) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
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
    input.value = input.value.slice(0, start) + sanitizeNumbersOnly(pasted) + input.value.slice(end);
    this.syncSanitizedValue(input);
  }

  private syncSanitizedValue(input: HTMLInputElement) {
    const sanitized = sanitizeNumbersOnly(input.value);
    if (input.value !== sanitized) {
      input.value = sanitized;
    }
    if (this.ngControl?.control?.value !== sanitized) {
      this.ngControl?.control?.setValue(sanitized);
    }
  }
}
