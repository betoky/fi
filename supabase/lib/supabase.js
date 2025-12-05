import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

let supabaseClient = null;

/**
 * @returns {SupabaseClient}
 */
export function getSupabaseClient() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) throw new Error('Supabase env vars missing');

    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}
