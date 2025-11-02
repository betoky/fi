import { inject, Injectable } from '@angular/core';
import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class User {
  private supabase = inject(Supabase).getInstance();

  async saveUser(auth_id: string, name: string) {
    const { error } = await this.supabase.from('users').insert([{ auth_id, name }]).select();
    if (error) {
      throw error;
    }
  }

  async hasProfile() {
    const { error, count } = await this.supabase.from('users').select('*', { count: 'exact' });
    if (error) {
      throw error;
    }

    return count ? count > 0 : false;
  }
}
