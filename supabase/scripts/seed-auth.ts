import users from '../data/users';
import { createSupabaseUser, getSupabaseUsers } from '../lib/supabase-user';

async function mockAuth() {
  console.log('Seed supabase auth');
  const { total } = await getSupabaseUsers();

  if (total > 0) {
    throw 'Supabase auth table is not empty, skip mock.';
  }

  const request = users.map(
    async ({ email, password }) => await createSupabaseUser(email, password)
  );

  await Promise.all(request);
  console.log('');
}

export default mockAuth;
