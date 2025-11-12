import { inject, Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { Tables } from '../../../database.types';

@Injectable({
  providedIn: 'root'
})
export class User {
  private supabase = inject(Supabase).getInstance();
  private currentUser: Tables<'users'> | null = null;

  async saveUser(auth_id: string, name: string) {
    const { error } = await this.supabase.from('users').insert([{ auth_id, name }]).select();
    if (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    const { data, error } = await this.supabase.from('users').select('*');
    if (error) {
      throw error;
    }

    return data.length === 0 ? null : data[0];
  }

  resetCurrentUser() {
    this.currentUser = null;
  }

  async hasProfile() {
    const { error, count } = await this.supabase.from('users').select('*', { count: 'exact' });
    if (error) {
      throw error;
    }

    return count ? count > 0 : false;
  }
}
