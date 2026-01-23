import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'p-datepicker[p-datepicker-focus-fix]',
})
export class DatepickerFocusFix {
  @HostListener('onShow')
  onShow = () => (document.activeElement as HTMLInputElement).blur();
}
