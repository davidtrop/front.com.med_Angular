import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  Optional,
  Self
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: 'input[appPhoneMask], input[appTelefoneMask], input[type="tel"]',
  standalone: true
})
export class PhoneMaskDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() @Self() private ngControl: NgControl
  ) {}

  ngOnInit(): void {
    const input = this.el.nativeElement;
    input.maxLength = 15;

    // Formata o valor inicial já presente no input ou no model
    if (input.value) {
      const formatted = this.applyMask(input.value);
      if (formatted !== input.value) {
        input.value = formatted;
        if (this.ngControl?.control) {
          this.ngControl.control.setValue(formatted, { emitEvent: false });
        }
      }
    }

    // Acompanha alterações programáticas no FormControl
    if (this.ngControl?.control) {
      this.ngControl.control.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((val) => {
          if (val && typeof val === 'string') {
            const formatted = this.applyMask(val);
            if (formatted !== val) {
              this.ngControl?.control?.setValue(formatted, { emitEvent: false });
              this.el.nativeElement.value = formatted;
            }
          }
        });
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;
    const initialValue = input.value;
    const cursorPos = input.selectionStart ?? initialValue.length;
    const digitsBeforeCursor = initialValue.slice(0, cursorPos).replace(/\D/g, '').length;

    const formatted = this.applyMask(initialValue);
    input.value = formatted;

    if (this.ngControl?.control) {
      this.ngControl.control.setValue(formatted, { emitViewToModelChange: true });
    }

    // Posiciona o cursor de forma inteligente após a inserção da máscara
    if (cursorPos >= initialValue.length) {
      input.setSelectionRange(formatted.length, formatted.length);
    } else {
      let newCursorPos = 0;
      let count = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
          count++;
        }
        if (count === digitsBeforeCursor) {
          newCursorPos = i + 1;
          break;
        }
      }
      if (digitsBeforeCursor === 0) {
        newCursorPos = formatted.startsWith('(') ? 1 : 0;
      }
      input.setSelectionRange(newCursorPos, newCursorPos);
    }
  }

  /**
   * Aplica a máscara (##) #####-#### para celulares (11 dígitos)
   * ou (##) ####-#### para fixos (10 dígitos).
   */
  public applyMask(val: string | null | undefined): string {
    if (!val) return '';
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';

    // Se for telefone fixo completo (10 dígitos e o 3º dígito não for '9')
    if (digits.length === 10 && digits[2] !== '9') {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
    }

    // Formato padrão (##) #####-####
    if (digits.length <= 2) {
      return `(${digits}`;
    }
    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
