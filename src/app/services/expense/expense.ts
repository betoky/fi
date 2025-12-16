import { Injectable, inject } from '@angular/core';
import { CreateExpenseType, UpdateExpenseType } from '@/domains/expense';
import { Supabase } from '@/services/supabase';

@Injectable({
  providedIn: 'root',
})
export class Expense {
  private supabase = inject(Supabase).getInstance();

  async fetchExpenses(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const { data, error } = await this.supabase
      .from('expenses')
      .select('*, article:expense_items(*)')
      .range(start, end)
      .order('date', { ascending: false });
    if (error) throw error;

    return data;
  }

  async saveExpenses(expenses: CreateExpenseType[]) {
    const { error } = await this.supabase.from('expenses').insert(expenses).select();
    if (error) throw error;
  }

  async updateExpense(id: string, value: UpdateExpenseType) {
    const { error } = await this.supabase.from('expenses').update(value).eq('id', id);
    if (error) throw error;
  }

  async deleteExpense(id: string) {
    const { error } = await this.supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  }
}
