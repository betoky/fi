import data from '../data/users.json';
import { getSupabaseUsers } from '../lib/supabase-user';
import { saveHomes } from '../lib/homes';
import { saveUsers } from '../lib/users';

export default async function mockUsersData() {
  console.log('Seed users and homes data');
  const dataMap = new Map(data.map((user) => [user.email, user]));
  const { users } = await getSupabaseUsers();
  const savedUsers = await saveUsers(
    users.map(({ id, email }) => ({ auth_id: id, name: dataMap.get(email!)!.name }))
  );
  const savedHomes = await saveHomes(
    users.map(({ id, email }) => {
      const { currency, home } = dataMap.get(email!)!;
      return { owner_id: id, name: home, currency: currency as 'EUR' | 'MGA' | 'USD' };
    })
  );
  console.log('');
  return [savedUsers, savedHomes];
}
