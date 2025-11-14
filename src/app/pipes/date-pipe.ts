import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDate'
})
export class DatePipe implements PipeTransform {

  transform(value: Date|string, locale = 'fr-FR', options?: Intl.DateTimeFormatOptions): string {
    if (!value) {
      throw new Error('Require date');
    }

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    options = {
      weekday: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }

    return new Intl.DateTimeFormat(
      locale,
      options || { hourCycle: 'h23', timeStyle: 'long' }
    ).format(date);
  }

}