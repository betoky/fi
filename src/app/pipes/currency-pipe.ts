import { inject, Pipe, PipeTransform } from '@angular/core';
import { Enums } from '@/database.types';
import { Home } from '@/services/supabase/home';
import { formatCurrency } from '@/utils/number';

@Pipe({
  name: 'appCurrency',
})
export class CurrencyPipe implements PipeTransform {
  private home = inject(Home).instance;

  transform(value: number, currency?: Enums<'Currency'>): string {
    if (value === null || value === undefined) {
      throw new Error('No value found');
    }

    const currentHome = this.home();
    if (!currentHome) {
      throw new Error('Permission denied');
    }

    return formatCurrency(value, currency ?? currentHome.currency);
  }
}
