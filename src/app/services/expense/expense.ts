import { inject, Injectable } from '@angular/core';
import { Supabase } from '../supabase';
import {
  CreateExpenseGroupType,
  CreateExpenseType,
  ExpenseViewGroupType,
  ExpenseViewType,
  isExpenseViewGroup,
  UpdateExpenseType,
} from '../../domain/expense';
import { mapById } from '../../utils/object';

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

  async deleteExpense(id: string) {
    const { error } = await this.supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  }

  async deleteGroupedExpense(id: string) {
    const { error } = await this.supabase.from('expense_groups').delete().eq('id', id);
    if (error) throw error;
  }

  async fetchGroupByIds(ids: string[]) {
    if (ids.length === 0) {
      throw new Error('Attempt to fetch empty group expense');
    }
    const { data, error } = await this.supabase
      .from('expense_groups')
      .select('*')
      .or(ids.map((i) => 'id.eq.' + i).join(','));

    if (error) throw error;

    return data;
  }

  async fetchExpenseForView(limit = 10) {
    const { data: expenses, error } = await this.supabase
      .from('expenses')
      .select(
        'id, date, amount, quantity, description, article_id, article:expense_items(name, unit, category_id), group_id'
      )
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const groupIds = expenses.map((i) => i.group_id).filter((i) => i !== null);

    if (groupIds.length === 0) {
      return expenses.map(({ group_id, ...data }) => ({ ...data }));
    }

    const groups = await this.fetchGroupByIds(Array.from(groupIds.values()));
    const mappedGroups = mapById(groups);

    const results: (ExpenseViewType | ExpenseViewGroupType)[] = [];
    for (const { group_id, ...data } of expenses) {
      if (!group_id) {
        results.push(data);
        continue;
      }
      const groupInResult = results.find(
        (element) => isExpenseViewGroup(element) && element.id === group_id
      );
      if (groupInResult && isExpenseViewGroup(groupInResult)) {
        groupInResult.items.push(data);
        continue;
      }
      results.push({
        ...mappedGroups.get(group_id)!,
        items: [data],
      });
    }

    return results;
  }

  async saveExpense(...expenses: CreateExpenseType[]) {
    const { error } = await this.supabase.from('expenses').insert(expenses).select();
    if (error) throw error;
  }

  async updateExpense(id: string, value: UpdateExpenseType) {
    const { error } = await this.supabase.from('expenses').update(value).eq('id', id);
    if (error) throw error;
  }
}
