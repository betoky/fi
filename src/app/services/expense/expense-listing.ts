import { inject, Injectable, signal } from '@angular/core';
import { ExpenseViewType, ExpenseViewGroupType } from '../../domain/expense';
import { Expense } from './expense';

@Injectable({
  providedIn: 'root',
})
export class ExpenseListing {
  private expense = inject(Expense);

  expenses = signal<(ExpenseViewType | ExpenseViewGroupType)[] | undefined>(undefined);

  fetchData() {
    this.expense.fetchExpenseForView().then((data) => this.expenses.set(data));
  }

  async removeSimpleExpense(id: string) {
    await this.expense.deleteExpense(id);
    this.fetchData();
  }

  async removeGroupedExpense(id: string) {
    await this.expense.deleteGroupedExpense(id);
    this.fetchData();
  }
}
