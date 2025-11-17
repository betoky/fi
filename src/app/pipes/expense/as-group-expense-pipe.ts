import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseViewGroupType, isExpenseViewGroup } from '../../domain/expense';

@Pipe({
  name: 'asGroupExpense'
})
export class AsGroupExpensePipe implements PipeTransform {

  transform(value: unknown): ExpenseViewGroupType|null {
    return isExpenseViewGroup(value) ? value : null;
  }

}
