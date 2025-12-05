import { getSupabaseClient } from '../lib/supabase.js';

const supabase = getSupabaseClient();
const authUsers = [
  {
    email: 'rakotobe@fi.com',
    password: 'password',
  },
  {
    email: 'bekoto@fi.com',
    password: 'password',
  },
  {
    email: 'radaniela@fi.com',
    password: 'password',
  },
  {
    email: 'bezafy@fi.com',
    password: 'password',
  },
];

async function mockAuth() {
  console.log('Start to seed auth table');
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();
  if (error) throw error;

  if (users.length > 0) {
    throw 'Supabase auth table is not empty, skip mock.';
  }

  for (const { email, password } of authUsers) {
    const { data: {user}, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) {
      console.log(`Failed to save ${email}`);
      continue;
    }
    console.log(`Created user: ${user.email} -> ${user.id}`);
  }
  console.log('\n');
}

export default mockAuth;
