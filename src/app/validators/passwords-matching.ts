import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsMatching: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirm');

  return password && confirm && password.valid && password.value === confirm.value
    ? null
    : { passwordsNotMatching: true };
};
