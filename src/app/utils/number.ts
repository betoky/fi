import { Enums } from '@/database.types';

export const hasMoreElement = (n: number) => n > 1 || (n > 0 && n < 1);

export const formatCurrency = (value: number, currency?: Enums<'Currency'>, locale = 'fr-FR') => {
  const options: Intl.NumberFormatOptions = {
    style: currency ? 'currency' : 'decimal',
  };
  if (currency) {
    options.currency = currency;
    options.currencyDisplay = 'narrowSymbol';
  }
  return new Intl.NumberFormat(locale, options).format(value);
};
