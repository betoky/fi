import { categories } from '../data/expenses';
import { getHomes } from '../lib/homes';
import { getSupabaseClient } from '../lib/supabase';

type Cat = { name: string; parent: string | null };

// Fisher-Yates shuffle
function shuffle<T>(entries: T[]) {
  const deepCopy = [...entries];
  for (let i = deepCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deepCopy[i], deepCopy[j]] = [deepCopy[j], deepCopy[i]];
  }
  return deepCopy;
}

function getRandom<T>(entries: T[]) {
  const items = shuffle(entries);
  const n = Math.max(Math.floor(entries.length / 4), Math.floor(Math.random() * entries.length));
  return items.slice(0, n);
}

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

export default async function mockExpensesCategories() {
  console.log('Seed expenses categories');

  const catMap = new Map<string, Cat>();
  categories.forEach(({ id, name, sub }) => {
    catMap.set(id, { name, parent: null });
    sub.forEach(({ id: child, name: nameChild }) =>
      catMap.set(child, { name: nameChild, parent: id })
    );
  });

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
    console.log(` - ${home.name} has ${count} categories.`);
  }

  console.log('');
}
