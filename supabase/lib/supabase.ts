import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './../../database.types';

dotenv.config({ path: '.env.local' });

console.log('');

let supabaseClient: SupabaseClient<Database>|null = null;
export function getSupabaseClient() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) throw new Error('Supabase env vars missing');

    supabaseClient = createClient<Database>(url, key);
  }
  return supabaseClient;
}
