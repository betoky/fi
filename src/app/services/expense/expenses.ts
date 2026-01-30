import {
  EditableExpense,
  ExpenseFilter,
  ExpenseType,
  ExpFetchParams,
  UpdateExpenseType,
} from '@/domains/expense';
import { ExpenseFormType } from '@/domains/expense-form';
import { Period } from '@/domains/period';
import { Expense } from '@/services/supabase/expense';
import { Home } from '@/services/supabase/home';
import { dailyRange, isTheSameWithoutTime } from '@/utils/date';
import { getDetailsChange, getExpenseChange } from '@/utils/expense';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Expenses {
  private expense = inject(Expense);
  private home = inject(Home);
  private listingState: ExpFetchParams = { type: 'all', limit: 12 };

  expenses = signal<ExpenseType[] | undefined>(undefined);
  hasNext = signal(false);

  async load(options?: { reset?: boolean }) {
    const [data, state, next] = await this.expense.fetch(this.listingState);

    this.hasNext.set(next);
    this.updateListingState(state);

    const old = options?.reset ? [] : this.expenses();
    this.expenses.set(old ? [...old, ...data] : data);
  }

  search(keyword: string) {
    // Only cursor state was reset
    this.listingState = {
      ...this.listingState,
      cursor: null,
      keyword: keyword.length > 0 ? keyword : undefined,
    };
    this.load({ reset: true });
  }

  applyFilter({ type, amount, date, order, categorieIds }: ExpenseFilter) {
    this.reset();
    if (type) {
      this.listingState.type = type;
    }
    if (categorieIds && categorieIds.length > 0) {
      this.listingState.categories = {
        ids: categorieIds,
      };
    }
    if (order) {
      this.listingState.order = order;
    }
    if (date) {
      const asTuple = Array.isArray(date);
      this.listingState.date = {
        min: asTuple ? dailyRange(date[0])[0] : dailyRange(date)[0],
        max: asTuple ? dailyRange(date[1])[1] : dailyRange(date)[1],
      };
    }
    if (amount) {
      this.listingState.amount = amount;
    }
    this.load({ reset: true });
  }

  reset(andFetch = false) {
    this.listingState = { type: 'all', limit: 12 };
    andFetch && this.load({ reset: true });
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
    if (expenseChange) {
      this.expense.updateExpense(id, expenseChange).then((data) => this.syncExpenses(data));
    }
    // Update request
    await Promise.all([
      ...addedCategories.map((categoryId) =>
        this.expense.addExpCategoryRelation(id, categoryId, homeId),
      ),
      ...removedCategories.map((categoryId) =>
        this.expense.deleteExpCategoryRelation(id, categoryId),
      ),
      ...addedDetails.map((data) => this.expense.saveDetail(id, data, homeId)),
      ...changedDetails.map(({ id, ...data }) => this.expense.updateDetail(id, data)),
      ...removedDetails.map((id) => this.expense.deleteDetail(id)),
    ]);
  }

  async updateExpense(id: number, data: UpdateExpenseType) {
    const updated = await this.expense.updateExpense(id, data);
    this.syncExpenses(updated);
  }

  async removeExpense(id: number) {
    await this.expense.deleteExpense(id);
    this.reset(true);
  }

  async summary(date: Date, period: Period) {
    return this.expense.getExpSummary(date, period);
  }

  private syncExpenses(update: ExpenseType) {
    const list = this.expenses()!;
    const index = list.findIndex((i) => i.id === update.id);
    list[index] = update;

    this.expenses.set(list);
  }

  private hasDuplicateCursor(prev: ExpFetchParams['cursor'], cursor: ExpFetchParams['cursor']) {
    if (!prev || !cursor) return false;

    if (typeof prev !== typeof cursor) return false;

    if (typeof prev === 'number') {
      return prev === cursor;
    }

    return isTheSameWithoutTime(prev, cursor as Date);
  }

  private updateListingState(current: ExpFetchParams) {
    const { cursor: prevCursor, exclude: prevExclude } = this.listingState;
    const { cursor, exclude } = current;

    if (exclude && prevExclude && this.hasDuplicateCursor(prevCursor, cursor)) {
      current.exclude = [...prevExclude, ...exclude];
    }

    this.listingState = current;
  }
}
