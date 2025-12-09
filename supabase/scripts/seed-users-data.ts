import usersArray from '../data/users';
import { getSupabaseUsers } from '../lib/supabase-user';
import { saveHomes } from '../lib/homes';
import { saveUsers } from '../lib/users';

export default async function mockUsersData() {
  console.log('Start to seed users and homes tables');
  const usersMap = new Map(usersArray.map((user) => [user.email, user]));
  const { users } = await getSupabaseUsers();
  await saveUsers(
    users.map(({ id, email }) => ({ auth_id: id, name: usersMap.get(email!)!.name }))
  );
  await saveHomes(
    users.map(({ id, email }) => ({ owner_id: id, name: usersMap.get(email!)!.home }))
  );
}
