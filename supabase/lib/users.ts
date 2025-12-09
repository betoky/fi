import { getSupabaseClient } from './supabase';

export async function saveUsers(users: { auth_id: string; name: string }[]) {
  const { data, error } = await getSupabaseClient().from('users').insert(users).select();

  if (error) {
    console.log(error);
    throw new Error('Failed to save users');
  }

  console.log(` - Users: ${data.map(({ name }) => name).join(', ')} are saved`);
}
