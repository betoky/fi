import { inject, Injectable } from '@angular/core';
import { Supabase } from '../supabase';

@Injectable({
  providedIn: 'root',
})
export class Category {
  private supabase = inject(Supabase).getInstance();

  async fetchCategories() {
    const { data, error } = await this.supabase
      .from('expense_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return data;
  }
}
