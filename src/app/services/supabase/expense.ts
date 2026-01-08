import { Injectable, inject } from '@angular/core';
import { UpdateExpenseType } from '@/domains/expense';
import { Supabase } from '@/services/supabase';
import { ExpenseFormData } from '@/domains/expense-form';
import { PriceInfo, UpdateExpDetail } from '@/domains/expense-detail';

export type ExpFetchParams = {
  type: 'all' | 'group' | 'simple';
  cursor?: Date;
  categories?: string[];
  dateInterval?: {
    min: Date;
    max: Date;
  };
  order?: {
    field: 'categories' | 'amount';
    ascending: boolean;
  };
  limit?: number;
};

@Injectable({
  providedIn: 'root',
})
export class Expense {
  private supabase = inject(Supabase).getInstance();

  async fetch({ order, type, categories, cursor, dateInterval, limit = 10 }: ExpFetchParams) {
    const query = this.supabase.from('expenses').select();

    if (cursor && !dateInterval) {
      query.lt('date', cursor.toISOString());
    }

    if (dateInterval) {
      query.gt('date', dateInterval.min.toISOString());
      query.lt('date', cursor?.toISOString() ?? dateInterval.max.toISOString());
    }

    if (type !== 'all') {
      query.eq('as_group', type === 'group');
    }

    // TODO filter by categories

    query.order('date', { ascending: false });
    if (order) {
      const { field, ascending } = order;
      query.order(field, { ascending });
    }

    const { data, error } = await query.limit(limit);

    if (error) throw error;

    return data;
  }

  async fetchDetails(id: number) {
    const { data, error } = await this.supabase
      .from('expense_details')
      .select('*, article:expense_items(*)')
      .eq('expense_id', id);

    if (error) throw error;
    return data;
  }

  async saveAsGroup({ date, description, items, name }: ExpenseFormData) {
    const { data, error } = await this.supabase.rpc('save_expenses_as_group', {
      p_items: items,
      p_name: name,
      p_description: description,
      p_date: date.toISOString(),
    });

    if (error) throw error;

    return data;
  }

  async saveExpenses({ date, description, items }: Omit<ExpenseFormData, 'name'>) {
    const { error } = await this.supabase.rpc('save_expenses', {
      p_items: items,
      p_description: description,
      p_date: date.toISOString(),
    });
    if (error) throw error;
  }

  async saveDetail(
    expense_id: number,
    data: PriceInfo & { article_id: number },
    home_id: string
  ) {
    const { error } = await this.supabase
      .from('expense_details')
      .insert([{ expense_id, home_id, ...data }])
      .select();
    if (error) throw error;
  }

  async updateExpense(id: number, value: UpdateExpenseType) {
    const { error, data } = await this.supabase
      .from('expenses')
      .update(value)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateDetail(id: number, value: UpdateExpDetail) {
    const { error, data } = await this.supabase
      .from('expense_details')
      .update(value)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteExpense(id: number) {
    const { error } = await this.supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  }

  async deleteDetail(id: number) {
    const { error } = await this.supabase.from('expense_details').delete().eq('id', id);
    if (error) throw error;
  }

  async deleteExpCategoryRelation(expense_id: number, category_id: number) {
    const { error } = await this.supabase
      .from('expenses_categories')
      .delete()
      .eq('expense_id', expense_id)
      .eq('category_id', category_id);
    if (error) throw error;
  }

  async addExpCategoryRelation(expense_id: number, category_id: number, home_id: string) {
    const { error } = await this.supabase
      .from('expenses_categories')
      .insert([{ expense_id, category_id, home_id }])
      .select();
    if (error) throw error;
  }
}
