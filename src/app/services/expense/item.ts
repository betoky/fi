import { inject, Injectable } from '@angular/core';
import { Supabase } from '@/services/supabase';

@Injectable({
  providedIn: 'root',
})
export class Item {
  private supabase = inject(Supabase).getInstance();

  async fetchByCategory(...categories: string[]) {
    const constraints = categories.map((id) => `category_id.eq.${id}`);
    const { data, error } = await this.supabase
      .from('expense_items')
      .select('*')
      .or(constraints.join(','))
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  }

  async search(query: string, limit = 10) {
    const { data, error } = await this.supabase
      .from('expense_items')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return data;
  }
}
