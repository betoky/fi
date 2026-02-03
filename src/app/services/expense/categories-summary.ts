import { Database } from '@/database.types';
import { Period } from '@/domains/period';
import { Expense } from '@/services/supabase/expense';
import { getWeekRange } from '@/utils/date';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

export type CategoryDataChart = Database['public']['Functions']['get_expenses_summary']['Returns'];

@Injectable({
  providedIn: 'root',
})
export class CategoriesSummary {
  private expense = inject(Expense);
  private date = signal(new Date());
  private _period = signal<Period>('month');
  displayDate = computed(() => {
    const current = this.date();
    switch (this._period()) {
      case 'day':
        return Intl.DateTimeFormat('fr-Fr').format(current);

      case 'week':
        const [start, end] = getWeekRange(current);
        return Intl.DateTimeFormat('fr-Fr').formatRange(start, end);

      case 'month':
        return Intl.DateTimeFormat('fr-Fr', { month: 'long' }).format(current);

      case 'year':
        return current.getFullYear().toString();
    }
  });

  period = this._period.asReadonly();

  private _categories = signal<CategoryDataChart | undefined>(undefined);
  categories = this._categories.asReadonly();

  constructor() {
    effect(() => {
      this.expense
        .getExpSummary(this.date(), this._period())
        .then((data) => this._categories.set(data));
    });
  }

  changePeriod(value: Period) {
    this._period.set(value);
  }

  next() {
    const current = new Date(this.date());
    switch (this._period()) {
      case 'day':
        current.setDate(current.getDate() + 1);
        break;
      case 'week':
        current.setDate(current.getDate() + 7);
        break;
      case 'month':
        current.setMonth(current.getMonth() + 1);
        break;
      case 'year':
        current.setFullYear(current.getFullYear() + 1);
        break;

      default:
        throw new Error(`Invalid period type of ${this._period()}`);
    }
    this.date.set(current);
  }

  previous() {
    const current = new Date(this.date());
    switch (this._period()) {
      case 'day':
        current.setDate(current.getDate() - 1);
        break;
      case 'week':
        current.setDate(current.getDate() - 7);
        break;
      case 'month':
        current.setMonth(current.getMonth() - 1);
        break;
      case 'year':
        current.setFullYear(current.getFullYear() - 1);
        break;

      default:
        throw new Error(`Invalid period type of ${this._period()}`);
    }
    this.date.set(current);
  }
}
