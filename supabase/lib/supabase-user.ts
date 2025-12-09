import { getSupabaseClient } from '../lib/supabase';

export async function getSupabaseUsers() {
  const { data, error } = await getSupabaseClient().auth.admin.listUsers();
  if (error) throw new Error('Failed to fetch supabase users', { cause: error });

  return data;
}

export async function createSupabaseUser(email: string, password: string) {
  const {
    data: { user },
    error,
  } = await getSupabaseClient().auth.admin.createUser({ email, password, email_confirm: true });
  if (error) {
    throw new Error(`Failed to save ${email}`, { cause: error });
  }
  console.log(`Created user: ${user?.email} -> ${user?.id}`);
}
