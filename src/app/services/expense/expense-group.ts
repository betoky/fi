import { inject, Injectable } from '@angular/core';
import { CreateExpenseGroupType, UpdateExpenseGroupType } from '@/domains/expense-group';
import { Supabase } from '@/services/supabase';

@Injectable({
  providedIn: 'root',
})
export class ExpenseGroup {
  private supabase = inject(Supabase).getInstance();

  async fetchGroups(limit = 10) {
    const { data, error } = await this.supabase
      .from('expense_groups')
      .select()
      .order('date', { ascending: false })
      .limit(limit);
    if (error) throw error;

    return data;
  }

  async fetchGroupItems(groupId: string) {
    const { data, error } = await this.supabase
      .from('expense_grouped')
      .select('*, article:expense_items(*)')
      .eq('group_id', groupId);
    if (error) throw error;
    return data;
  }

  async saveExpGroup({ date, description, items, name, categories }: CreateExpenseGroupType) {
    const { data, error } = await this.supabase.rpc('create_expense_group_with_items', {
      p_categories: categories,
      p_name: name,
      p_description: description ?? undefined,
      p_items: items,
      p_date: date,
    });
    if (error) throw error;

    return data;
  }

  async updateExpGroup(
    id: string,
    {
      name,
      description,
      newCategories,
      newItems,
      oldItems,
      oldCategories,
      updateItems,
    }: UpdateExpenseGroupType
  ) {
    const { data, error } = await this.supabase.rpc('update_expense_group_with_items', {
      p_id: id,
      p_new_categories: newCategories,
      p_old_categories: oldCategories,
      p_old_items: oldItems,
      p_new_items: newItems,
      p_update_items: updateItems,
      p_name: name,
      p_description: description ?? undefined,
    });
    if (error) throw error;

    return data;
  }

  async deleteExpGroup(id: string) {
    const { error } = await this.supabase.from('expense_groups').delete().eq('id', id);
    if (error) throw error;
  }
}
