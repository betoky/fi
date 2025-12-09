import users from '../data/users';
import { createSupabaseUser, getSupabaseUsers } from '../lib/supabase-user';

async function mockAuth() {
  console.log('Start to seed auth table');
  const { total } = await getSupabaseUsers();

  if (total > 0) {
    throw 'Supabase auth table is not empty, skip mock.';
  }

  const request = users.map(async ({ email, password }) => {
    try {
      await createSupabaseUser(email, password);
    } catch (error) {
      console.error(error);
    }
  });

  await Promise.all(request);
}

export default mockAuth;
