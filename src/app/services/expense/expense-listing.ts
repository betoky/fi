import { inject, Injectable, signal } from '@angular/core';
import { Expense } from './expense';
import { ExpenseGroup } from './expense-group';
import { CreateExpenseType, ExpenseArticleType, UpdateExpenseType } from '../../domain/expense';
import { CreateExpenseGroupType, ExpenseGroupType } from '../../domain/expense-group';

@Injectable({
  providedIn: 'root',
})
export class ExpenseListing {
  private expense = inject(Expense);
  private expenseGroup = inject(ExpenseGroup);

  expenses = signal<(ExpenseArticleType | ExpenseGroupType)[] | undefined>(undefined);

  async fetchData() {
    const simpleViewReq = this.expense.fetchExpenses();
    const groupViewReq = this.expenseGroup.fetchGroups();
    const [simples, groups] = await Promise.all([simpleViewReq, groupViewReq]);
    const data = [...simples, ...groups].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.expenses.set(data);
  }

  async saveExpenses(expenses: CreateExpenseType[]) {
    await this.expense.saveExpenses(expenses);
    this.fetchData();
  }

  async saveAsGroupExpenses(expenseGroup:  CreateExpenseGroupType) {
    await this.expenseGroup.saveExpGroup(expenseGroup);
    this.fetchData();
  }

  async updateExpense(id: string, value: UpdateExpenseType) {
    await this.expense.updateExpense(id, value);
    this.fetchData();
  }

  async removeExpense(id: string) {
    await this.expense.deleteExpense(id);
    this.fetchData();
  }

  async removeGroupExpense(groupId: string) {
    await this.expenseGroup.deleteGroupExpense(groupId);
    this.fetchData();
  }
}
