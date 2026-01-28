import { Injectable, inject } from '@angular/core';
import { UpdateExpenseType, ExpenseType, ExpFetchParams } from '@/domains/expense';
import { Supabase } from '@/services/supabase';
import { ExpenseFormData } from '@/domains/expense-form';
import { PriceInfo, UpdateExpDetail } from '@/domains/expense-detail';
import { Home } from '@/services/supabase/home';
import { getMaxDate, getMinDate, isDate, isTheSameWithoutTime } from '@/utils/date';

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

    const { amount, categories, cursor, date, exclude, order, type, limit = 10, keyword } = params;

    const ascending = Boolean(order?.ascending);
    if (cursor) {
      if (isDate(cursor)) {
        ascending
          ? query.gte('date', (date ? getMaxDate(cursor, date.min) : cursor).toISOString())
          : query.lte('date', (date ? getMinDate(cursor, date.max) : cursor).toISOString());
      } else {
        ascending
          ? query.gte('amount', Math.max(cursor, amount?.min ?? 0))
          : query.lte('amount', Math.min(cursor, amount?.max ?? Number.POSITIVE_INFINITY));
      }
    }

    if (date) {
      const cursorNotDate = !isDate(cursor);
      if (!ascending || cursorNotDate) {
        query.gte('date', date.min.toISOString());
      }
      if (ascending || cursorNotDate) {
        query.lte('date', date.max.toISOString());
      }
    }

    if (amount) {
      const cursorNotAmount = isDate(cursor) || typeof cursor !== 'number';
      if (amount.min && (!ascending || cursorNotAmount)) {
        query.gte('amount', amount.min);
      }
      if (amount.max && (ascending || cursorNotAmount)) {
        query.lte('amount', amount.max);
      }
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

    if (keyword && keyword.trim().length > 0) {
      query.ilike('name', `%${keyword.trim()}%`);
    }

    if (exclude) {
      query.not('id', 'in', `(${exclude.join(',')})`);
    }

    if (order) {
      const { field, ascending } = order;
      query.order(field, { ascending });
    }
    if (!order) {
      query.order('date', { ascending: false });
    }

    const { data, error } = await query.limit(limit);

    if (error) throw error;

    if (!categories) {
      hasNext = data.length === limit;
      const lastItem = data[data.length - 1];
      if (hasNext) {
        params['cursor'] = order?.field === 'amount' ? lastItem.amount : new Date(lastItem.date);
        params['exclude'] =
          order?.field === 'amount'
            ? data.filter((i) => i.amount === lastItem.amount).map(({ id }) => id)
            : data
                .filter((i) => isTheSameWithoutTime(new Date(i.date), new Date(lastItem.date)))
                .map(({ id }) => id);
      } else {
        params['cursor'] = null;
        params['exclude'] = null;
      }
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
