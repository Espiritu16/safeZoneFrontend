import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, forwardRef, signal, computed, inject } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { filterLimaDistricts, resolveLimaDistrict } from '../../utils/lima-districts';

let nextDistrictComboboxId = 0;

@Component({
  selector: 'app-district-combobox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './district-combobox.component.html',
  styleUrl: './district-combobox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DistrictComboboxComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DistrictComboboxComponent),
      multi: true,
    },
  ],
})
export class DistrictComboboxComponent implements ControlValueAccessor, Validator {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input() id = `district-combobox-${++nextDistrictComboboxId}`;
  @Input() placeholder = 'Buscar distrito de Lima';
  @Input() required = false;
  @Input() invalid = false;
  @Input() inputTestId?: string;

  protected readonly searchText = signal('');
  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(0);
  protected disabled = false;

  protected readonly options = computed(() => filterLimaDistricts(this.searchText()));
  protected readonly isInvalid = computed(() => this.invalid || this.hasValidationError());

  protected selectedValue = '';
  private touched = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private onValidatorChange: () => void = () => undefined;

  writeValue(value: string | null | undefined): void {
    const district = resolveLimaDistrict(value);
    this.selectedValue = district ?? '';
    this.searchText.set(district ?? value ?? '');
    this.activeIndex.set(0);
    this.onValidatorChange();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.isOpen.set(false);
    }
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    if (this.hasValidationError()) {
      return this.required && !this.searchText().trim() ? { required: true } : { districtInvalid: true };
    }

    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  protected openList(): void {
    if (this.disabled) {
      return;
    }

    this.isOpen.set(true);
    this.activeIndex.set(0);
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.isOpen.set(true);
    this.activeIndex.set(0);

    const district = resolveLimaDistrict(value);
    this.selectedValue = district ?? '';
    this.onChange(district ?? '');
    this.onValidatorChange();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    const options = this.options();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.isOpen.set(true);
      this.activeIndex.update((index) => Math.min(index + 1, Math.max(options.length - 1, 0)));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === 'Enter' && this.isOpen()) {
      event.preventDefault();
      const option = options[this.activeIndex()];
      if (option) {
        this.selectDistrict(option);
      }
      return;
    }

    if (event.key === 'Escape') {
      this.isOpen.set(false);
    }
  }

  protected selectDistrict(district: string): void {
    this.selectedValue = district;
    this.searchText.set(district);
    this.isOpen.set(false);
    this.onChange(district);
    this.markTouched();
    this.onValidatorChange();
  }

  protected onBlur(): void {
    const district = resolveLimaDistrict(this.searchText());

    if (district) {
      this.selectDistrict(district);
      return;
    }

    if (!this.searchText().trim()) {
      this.selectedValue = '';
      this.onChange('');
    }

    this.markTouched();
    this.onValidatorChange();
  }

  protected optionId(index: number): string {
    return `${this.id}-option-${index}`;
  }

  @HostListener('document:mousedown', ['$event'])
  protected closeOnOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  private markTouched(): void {
    if (this.touched) {
      return;
    }

    this.touched = true;
    this.onTouched();
  }

  private hasValidationError(): boolean {
    const text = this.searchText().trim();

    if (this.required && !text) {
      return this.touched;
    }

    return Boolean(text && this.selectedValue !== resolveLimaDistrict(text));
  }
}
