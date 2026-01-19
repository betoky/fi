import { EditableExpense, ExpenseType, UpdateExpenseType } from '@/domains/expense';
import { UpdateExpDetail } from '@/domains/expense-detail';
import { ExpenseFormType } from '@/domains/expense-form';
import { Expense, ExpFetchParams } from '@/services/supabase/expense';
import { Home } from '@/services/supabase/home';
import { getDetailsChange, getExpenseChange } from '@/utils/expense';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Expenses {
  private expense = inject(Expense);
  private home = inject(Home);
  private listingState: ExpFetchParams = { type: 'all', limit: 15 };

  expenses = signal<ExpenseType[] | undefined>(undefined);
  hasNext = signal(false);

  async load() {
    const [data, state, next] = await this.expense.fetch(this.listingState);
    const old = this.expenses();
    this.expenses.set(old ? [...old, ...data] : data);
    this.listingState = state;
    this.hasNext.set(next);
  }

  async reset(andFetch = false) {
    this.listingState = { type: 'all', limit: 15 };
    andFetch && this.load();
  }

  async save(value: ExpenseFormType, asGroup: boolean) {
    const { date, name, description, items: data } = value;

    const items = data.map(({ amount, quantity, item }) => ({
      amount,
      quantity,
      article_id: item.id,
    }));

    if (asGroup) {
      if (!name) throw 'Group title required';
      await this.expense.saveAsGroup({ date, name, description, items });
      this.reset(true);
      return;
    }

    await this.expense.saveExpenses({ date, description, items });
    this.reset(true);
  }

  async updateExpGroup(id: number, formData: ExpenseFormType, oldData: EditableExpense) {
    const expenseChange = getExpenseChange(formData, oldData);
    const { addedCategories, removedCategories, addedDetails, changedDetails, removedDetails } =
      getDetailsChange(formData.items, oldData.items);

    const homeId = this.home.instance()!.id;
    // Update request
    const res = await Promise.all([
      this.expense.updateExpense(id, expenseChange),
      ...addedCategories.map((categoryId) =>
        this.expense.addExpCategoryRelation(id, categoryId, homeId)
      ),
      ...removedCategories.map((categoryId) =>
        this.expense.deleteExpCategoryRelation(id, categoryId)
      ),
      ...addedDetails.map((data) => this.expense.saveDetail(id, data, homeId)),
      ...changedDetails.map(({ id, ...data }) => this.expense.updateDetail(id, data)),
      ...removedDetails.map((id) => this.expense.deleteDetail(id)),
    ]);
    this.syncExpenses(res[0]);
  }

  async updateExpense(id: number, data: UpdateExpenseType) {
    const updated = await this.expense.updateExpense(id, data);
    this.syncExpenses(updated);
  }

  async removeExpense(id: number) {
    await this.expense.deleteExpense(id);
    this.reset(true);
  }

  private syncExpenses(update: ExpenseType) {
    const list = this.expenses()!;
    const index = list.findIndex(i => i.id === update.id);
    list[index] = update;

    this.expenses.set(list);
  }
}
