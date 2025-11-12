import { inject, Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { Tables } from '../../../database.types';

@Injectable({
  providedIn: 'root'
})
export class User {
  private supabase = inject(Supabase).getInstance();
  private currentUser?: Tables<'users'> | null;

  async saveUser(auth_id: string, name: string) {
    const { error } = await this.supabase.from('users').insert([{ auth_id, name }]).select();
    if (error) {
      throw error;
    }
  }

  async getCurrentUser() {    
    if (this.currentUser !== undefined) {
      return this.currentUser;
    }

    const { data, error } = await this.supabase.from('users').select('*').maybeSingle();
    if (error) {
      throw error;
    }

    this.currentUser = data;
    return data;
  }

  resetCurrentUser() {
    this.currentUser = undefined;
  }

  async hasProfile() {
    if (this.currentUser !== undefined) {
      return this.currentUser !== null;
    }
    
    const user = await this.getCurrentUser();
    this.currentUser = user;
    return user !== null;
  }
}
