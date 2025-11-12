import { inject, Injectable } from '@angular/core';
import { Supabase } from '../supabase';
import { CreateExpenseGroupType, CreateExpenseType } from '../../domain/expense';

@Injectable({
  providedIn: 'root',
})
export class Expense {
  private supabase = inject(Supabase).getInstance();

  async createGroup(dto: CreateExpenseGroupType) {
    const { data, error } = await this.supabase.from('expense_groups').insert([dto]).select();

    if (error) throw error;

    return data[0];
  }

  async saveExpense(...expenses: CreateExpenseType[]) {
    const { error } = await this.supabase.from('expenses').insert(expenses).select();

    if (error) throw error;
  }
}
