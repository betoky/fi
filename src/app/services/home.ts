import { inject, Injectable } from '@angular/core';
import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class Home {
  private supabase = inject(Supabase).getInstance();

  async saveHome(owner_id: string, name: string) {
    const {error} = await this.supabase.from('homes').insert([{ owner_id, name }]).select();
    if (error) {
      throw error;
    }
  }

  async hasHome() {
    const { error, count } = await this.supabase.from('homes').select('*', { count: 'exact' });
    if (error) {
      throw error;
    }

    return count ? count > 0 : false;
  }
}
