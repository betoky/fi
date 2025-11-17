import { inject, Injectable, signal } from '@angular/core';
import { ExpenseViewType, ExpenseViewGroupType, UpdateExpenseType } from '../../domain/expense';
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

  async updateSimpleExpense(id: string, value: UpdateExpenseType) {
    await this.expense.updateExpense(id, value);
    this.fetchData();
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
