import { formatDate } from '@/utils/date';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDate'
})
export class DatePipe implements PipeTransform {

  transform(value: Date|string, locale = 'fr-FR', options?: Intl.DateTimeFormatOptions): string {
    if (!value) {
      throw new Error('Require date');
    }

    return formatDate(value, locale, options);
  }

}