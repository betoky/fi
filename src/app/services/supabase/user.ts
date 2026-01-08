import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Tables } from '@/database.types';
import { Supabase } from '@/services/supabase';

@Injectable({
  providedIn: 'root',
})
export class User {
  private supabase = inject(Supabase).getInstance();

  instance = signal<Tables<'users'> | null | undefined>(undefined);
  hasProfile$ = toObservable(this.instance).pipe(
    filter((user) => user !== undefined),
    map((user) => user !== null)
  );

  async saveUser(auth_id: string, name: string) {
    const { error } = await this.supabase.from('users').insert([{ auth_id, name }]).select();
    if (error) {
      throw error;
    }
  }

  async getUser() {
    const { data, error } = await this.supabase.from('users').select('*').maybeSingle();
    if (error) throw error;
    return data;
  }
}
