import { inject, Injectable, signal } from '@angular/core';
import { ExpenseArticleType, UpdateExpenseType } from '@/domains/expense';
import { ExpenseFormType } from '@/domains/expense-form';
import { ExpenseGroupType, ExpGrpItemType } from '@/domains/expense-group';
import { Expense } from '@/services/expense/expense';
import { ExpenseGroup } from '@/services/expense/expense-group';
import { Home } from '@/services/home';
import { buildExpenseGroup, buildExpenses, prepareExpGroupForUpdate } from '@/utils/expense';

@Injectable({
  providedIn: 'root',
})
export class ExpenseListing {
  private expense = inject(Expense);
  private expenseGroup = inject(ExpenseGroup);
  private home = inject(Home);

  expenses = signal<(ExpenseArticleType | ExpenseGroupType)[] | undefined>(undefined);

  async fetchData(page = 1) {
    const simpleViewReq = this.expense.fetchExpenses(page);
    const groupViewReq = this.expenseGroup.fetchGroups(page);
    const [simples, groups] = await Promise.all([simpleViewReq, groupViewReq]);
    const data = [...simples, ...groups].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const merged = [...Array.from(this.expenses() ?? []), ...data];
    this.expenses.set(merged);
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
