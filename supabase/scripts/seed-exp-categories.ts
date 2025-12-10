import { Cat, getCategories } from '../utils/expenses';
import { getRandom } from '../utils/array';
import { getHomes } from '../lib/homes';
import { getSupabaseClient } from '../lib/supabase';

function getRandomCat(entries: Map<string, Cat>) {
  const map = new Map<string, Set<string>>();
  getRandom(Array.from(entries.keys())).forEach((key) => {
    const { parent } = entries.get(key)!;
    if (parent && map.has(parent)) {
      const childs = map.get(parent);
      childs!.add(key);
      return;
    }

    if (parent) {
      const childs = new Set<string>();
      childs.add(key);
      map.set(parent, childs);
      return;
    }

    map.set(key, new Set());
  });

  const result: { id: string; sub: string[] }[] = [];
  map.forEach((sub, id) => result.push({ id, sub: Array.from(sub) }));
  return result;
}

async function saveCategories(entries: (Cat & { home_id: string })[]) {
  const { data, error } = await getSupabaseClient()
    .from('expense_categories')
    .insert(entries)
    .select('id');

  if (error) throw new Error('Failed to save expenses categories');

  return data.map(({ id }) => id);
}

export async function getCategoriesFor(home: string) {
  const { data, error } = await getSupabaseClient()
    .from('expense_categories')
    .select('*')
    .eq('home_id', home);

  if (error) throw error;

  return data;
}

export default async function mockExpensesCategories() {
  console.log('Seed expenses categories');

  const catMap = getCategories();

  const homes = await getHomes();

  for (const home of homes) {
    const home_id = home.id;
    const categories = getRandomCat(catMap);
    let count = 0;
    for (const { id, sub } of categories) {
      count++;
      const name = catMap.get(id)!.name;
      const saved = await saveCategories([{ home_id, name, parent: null }]);
      const childs = sub.map((i) => ({ home_id, parent: saved[0], name: catMap.get(i)!.name }));
      if (childs.length > 0) {
        count += childs.length;
        await saveCategories(childs);
      }
    }
    console.log(` - ${count} categories for ${home.name}.`);
  }

  console.log('');
}
