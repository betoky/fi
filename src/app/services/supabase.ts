import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'environments/environment.development';
import { Database } from '@/database.types';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private client = createClient<Database>(environment.supabaseUrl, environment.supabaseKey);

  getInstance() {
    return this.client;
  }
}
