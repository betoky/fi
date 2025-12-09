import { getSupabaseClient } from './supabase';

export async function saveHomes(homes: { owner_id: string; name: string }[]) {
  const { data, error } = await getSupabaseClient().from('homes').insert(homes).select();

  if (error) {
    console.log(error);
    throw new Error('Failed to save homes');
  }

  console.log(`Homes: ${data.map(({ name }) => name).join(', ')} are saved`);
}
