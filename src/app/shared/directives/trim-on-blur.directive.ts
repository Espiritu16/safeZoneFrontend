import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { normalizeText } from '../utils/input-sanitizers.util';

@Directive({
  selector: '[appTrimOnBlur]',
  standalone: true,
})
export class TrimOnBlurDirective {
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    const normalized = normalizeText(input.value);
    if (input.value !== normalized) {
      input.value = normalized;
    }
    if (this.ngControl?.control?.value !== normalized) {
      this.ngControl?.control?.setValue(normalized);
    }
  }
}
