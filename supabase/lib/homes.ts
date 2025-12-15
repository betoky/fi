import { getSupabaseClient } from './supabase';
import { Tables } from '../../database.types';

export async function saveHomes(homes: Tables<'homes'>[]) {
  const { data, error } = await getSupabaseClient().from('homes').insert(homes).select('*');

  if (error) {
    console.error(error);
    throw new Error('Failed to save homes');
  }

  console.log(` - Homes: ${data.map(({ name }) => name).join(', ')} are saved`);
  return data;
}
