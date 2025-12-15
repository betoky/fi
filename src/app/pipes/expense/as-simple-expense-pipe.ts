import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseArticleType, isExpense } from '@/domains/expense';

@Pipe({
  name: 'asSimpleExpense',
})
export class AsSimpleExpensePipe implements PipeTransform {
  transform(value: unknown): ExpenseArticleType | null {
    return isExpense(value) ? value : null;
  }
}
