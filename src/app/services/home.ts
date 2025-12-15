import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { Supabase } from './supabase';
import { HomeType } from '../domain/home';
import { Enums } from '../../../database.types';

@Injectable({
  providedIn: 'root',
})
export class Home {
  private supabase = inject(Supabase).getInstance();

  instance = signal<HomeType | undefined | null>(undefined);

  hasHome$ = toObservable(this.instance).pipe(
    filter((i) => i !== undefined),
    map((i) => i !== null)
  );

  async saveHome(owner_id: string, name: string, currency: Enums<'Currency'>) {
    const { error } = await this.supabase
      .from('homes')
      .insert([{ owner_id, name, currency }])
      .select();
    if (error) {
      throw error;
    }
  }

  async getHome(): Promise<HomeType | null> {
    const { data, error } = await this.supabase.from('homes').select('*').maybeSingle();
    if (error) throw error;

    return data;
  }
}
