import { Database } from "@/database.types";
import { Expense } from "@/services/supabase/expense";
import { inject, Injectable, signal } from "@angular/core";

type ExpAnnualData = Database['public']['Functions']['get_annual_exp_summary']['Returns']

@Injectable({ providedIn: 'root' })
export class ExpenseSummary {
  private db = inject(Expense);

  private _year = signal(new Date().getFullYear());
  year = this._year.asReadonly();

  _data =  signal<ExpAnnualData|undefined>(undefined);
  data = this._data.asReadonly();

  async load() {
    const data = await this.db.getAnnualSummary(this._year());
    this._data.set(data);
  }

  async next() {
    this._year.set(this.year() + 1);
    await this.load();
  }

  async previous() {
    this._year.set(this.year() - 1);
    await this.load();
  }

  reset() {
    this._year.set(new Date().getFullYear());
    this._data.set(undefined);
  }
}