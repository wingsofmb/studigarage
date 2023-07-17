import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const matchMinLength = control.value?.length >= 8;
    const matchMinLowercase = /[a-z]{1}/.test(control.value);
    const matchMinUppercase = /[A-Z]{1}/.test(control.value);
    const matchMinNumbers = /\d{1}/.test(control.value);
    const matchSymbols = /[!@#$&*]{1}/.test(control.value);
    const strongPassword = matchMinLength && matchMinLowercase && matchMinUppercase && matchMinNumbers && matchSymbols;
    return !strongPassword ? { strongPassword: { value: control.value } } : null;
  };
}
