import { inject, Injectable } from '@angular/core';
import { Supabase } from '../supabase';
import { CreateExpenseType, UpdateExpenseType } from '../../domain/expense';

@Injectable({
  providedIn: 'root',
})
export class Expense {
  private supabase = inject(Supabase).getInstance();
  

  async fetchExpenses(limit = 10) {
    const { data, error } = await this.supabase.from('expenses')
      .select('*, article:expense_items(*)')
      .order('date', { ascending: false })
      .limit(limit);
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
