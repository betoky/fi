import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCurrency',
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined) {
      throw new Error('No value found');
    }

    const formattedValue = new Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(value);

    return `${formattedValue} Ar`;
  }
}
