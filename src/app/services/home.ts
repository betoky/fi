import { inject, Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { HomeType } from '../domain/home';

@Injectable({
  providedIn: 'root',
})
export class Home {
  private supabase = inject(Supabase).getInstance();

  private currentHome?: HomeType|null;

  async saveHome(owner_id: string, name: string) {
    const {error} = await this.supabase.from('homes').insert([{ owner_id, name }]).select();
    if (error) {
      throw error;
    }
  }

  async getHome(): Promise<HomeType|null> {
    if (this.currentHome !== undefined) {
      return this.currentHome;
    }
    
    const {data, error} = await this.supabase.from('homes').select('*').maybeSingle();

    if (error) {
      throw error;
    }
    return data;
  }

  async hasHome() {
    if (this.currentHome !== undefined) {
      return this.currentHome !== null;
    }

    const home = await this.getHome();
    this.currentHome = home;
    return home !== null;
  }

  resetCurrentHome() {
    this.currentHome = undefined;
  }
}
