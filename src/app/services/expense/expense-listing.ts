import { inject, Injectable, signal } from '@angular/core';
import { Expense } from './expense';
import { ExpenseGroup } from './expense-group';
import { Home } from '../home';
import { buildExpenseGroup, buildExpenses, prepareExpGroupForUpdate } from '../../utils/expense';
import { ExpenseArticleType, UpdateExpenseType } from '../../domain/expense';
import { ExpenseGroupType, ExpGrpItemType } from '../../domain/expense-group';
import { ExpenseFormType } from '../../domain/expense-form';

@Injectable({
  providedIn: 'root',
})
export class ExpenseListing {
  private expense = inject(Expense);
  private expenseGroup = inject(ExpenseGroup);
  private home = inject(Home);

  expenses = signal<(ExpenseArticleType | ExpenseGroupType)[] | undefined>(undefined);

  async fetchData() {
    const simpleViewReq = this.expense.fetchExpenses();
    const groupViewReq = this.expenseGroup.fetchGroups();
    const [simples, groups] = await Promise.all([simpleViewReq, groupViewReq]);
    const data = [...simples, ...groups].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    this.expenses.set(data);
  }

  async updateExpGroup(id: string, value: ExpenseFormType, oldItems: ExpGrpItemType[]) {
    await this.expenseGroup.updateExpGroup(id, prepareExpGroupForUpdate(value, oldItems));
    this.fetchData();
  }

  async save(value: ExpenseFormType, asGroup: boolean) {
    if (asGroup) {
      if (!value.name) throw 'Group title required';
      await this.expenseGroup.saveExpGroup(buildExpenseGroup(value));
      this.fetchData();
      return;
    }

    const currentHome = await this.home.getHome();
    if (!currentHome) throw 'Unauthoriezed action';
    await this.expense.saveExpenses(buildExpenses(value, currentHome.id));
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
    await this.expenseGroup.deleteExpGroup(groupId);
    this.fetchData();
  }
}
