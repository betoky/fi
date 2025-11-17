import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseViewType, isExpenseSimpleView } from '../../domain/expense';

@Pipe({
  name: 'asSimpleExpense'
})
export class AsSimpleExpensePipe implements PipeTransform {

  transform(value: unknown): ExpenseViewType|null {
    return isExpenseSimpleView(value) ? value : null;
  }

}
