import { Injectable } from '@angular/core';
import { createClient } from "@supabase/supabase-js";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Supabase {
  private client = createClient(environment.supabaseUrl, environment.supabaseKey);

  getInstance() {
    return this.client;
  }
}
