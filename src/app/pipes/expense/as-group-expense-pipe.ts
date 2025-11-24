import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseGroupType, isExpenseGroup } from '../../domain/expense-group';

@Pipe({
  name: 'asGroupExpense',
})
export class AsGroupExpensePipe implements PipeTransform {
  transform(value: unknown): ExpenseGroupType | null {
    return isExpenseGroup(value) ? value : null;
  }
}
