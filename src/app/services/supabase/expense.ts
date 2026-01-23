import { Injectable, inject } from '@angular/core';
import { UpdateExpenseType, ExpenseType, ExpFetchParams } from '@/domains/expense';
import { Supabase } from '@/services/supabase';
import { ExpenseFormData } from '@/domains/expense-form';
import { PriceInfo, UpdateExpDetail } from '@/domains/expense-detail';
import { Home } from '@/services/supabase/home';

@Injectable({
  providedIn: 'root',
})
export class Expense {
  private supabase = inject(Supabase).getInstance();

  private home = inject(Home).instance;

  async fetch4GivenCategories(
    categories: NonNullable<ExpFetchParams['categories']>,
    ascending: boolean,
    limit: number,
  ): Promise<{ ids: number[]; cursor: number | null; hasNext: boolean }> {
    const query = this.supabase.from('expenses_categories').select('id, expense_id');

    const { ids, cursor } = categories;

    if (cursor) {
      ascending ? query.gt('id', cursor) : query.lt('id', cursor);
    }

    const { data, error } = await query
      .eq('home_id', this.home()!.id)
      .in('category_id', ids)
      .order('id', { ascending })
      .limit(limit);

    if (error) throw error;

    const hasNext = data.length === limit;

    return {
      hasNext,
      cursor: hasNext ? data[data.length - 1].id : null,
      ids: data.map((i) => i.expense_id),
    };
  }

  async fetch(params: ExpFetchParams): Promise<[ExpenseType[], ExpFetchParams, boolean]> {
    const query = this.supabase.from('expenses').select();

    const { order, type, categories, cursor, date, limit = 10, keyword } = params;

    if (keyword && keyword.trim().length > 0) {
      query.ilike('name', `%${keyword.trim()}%`);
    }

    if (cursor && !date) {
      query.lt('date', cursor.toISOString());
    }

    if (date) {
      query.gt('date', date.min.toISOString());
      if (date.min) {
      }
      query.lt('date', cursor?.toISOString() ?? date.max.toISOString());
    }

    if (type !== 'all') {
      query.eq('as_group', type === 'group');
    }

    let hasNext = false;
    if (categories && categories.ids.length > 0) {
      const {
        cursor: catCursor,
        ids,
        hasNext: next,
      } = await this.fetch4GivenCategories(categories, false, limit);
      query.in('id', ids);
      params['categories'] = { ids: categories.ids, cursor: catCursor };
      hasNext = next;
    }

    query.order('date', { ascending: false });
    if (order) {
      const { field, ascending } = order;
      query.order(field, { ascending });
    }

    const { data, error } = await query.limit(limit);

    if (error) throw error;

    if (!categories) {
      hasNext = data.length === limit;
      params['cursor'] = hasNext ? new Date(data[data.length - 1].date) : null;
    }

    return [data, params, hasNext];
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

  async saveDetail(expense_id: number, data: PriceInfo & { article_id: number }, home_id: string) {
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
