import data from '../data/expenses-items.json';
import { getSupabaseClient } from '../lib/supabase';
import { getCategoriesFor } from './seed-exp-categories';
import { Cat, getCategories } from '../utils/expenses';
import { sequenceBlock } from '../utils/array';

function getIncludedKeys<T extends { id: string; name: string }>(
  categories: T[],
  allCategories: Map<string, Cat>
) {
  const catMap = categories.reduce((map, { id, name }) => {
    map.set(name, id);
    return map;
  }, new Map<string, string>());

  const includeKeys = new Map<string, string>();
  const catNames = Array.from(catMap.keys());
  allCategories.forEach((category, key) => {
    if (catNames.includes(category.name)) {
      includeKeys.set(key, catMap.get(category.name)!);
    }
  });

  return includeKeys;
}

type ExpItem = {
  name: string;
  unit: string | null;
  category_id: string;
  home_id: string;
};

async function saveItems(items: ExpItem[]) {
  const { error } = await getSupabaseClient().from('expense_items').insert(items);

  if (error) {
    throw error;
  }
}

export async function getExpItems(home: string) {
  const { data, error } = await getSupabaseClient()
    .from('expense_items')
    .select('id, category_id, name')
    .eq('home_id', home);
  if (error) throw error;
  return data;
}

export default async function mockExpensesItems(homes: { id: string; name: string }[]) {
  console.log('Seed expenses items');

  const allCategories = getCategories();
  for (const home of homes) {
    const relatedCategories = await getCategoriesFor(home.id);
    const includedCatKeys = getIncludedKeys(relatedCategories, allCategories);
    const relatedCatKeys = Array.from(includedCatKeys.keys());
    const relatedItems = data
      .filter((i) => relatedCatKeys.includes(i.category))
      .map(({ name, unit, category }) => ({
        name,
        unit,
        category_id: includedCatKeys.get(category)!,
        home_id: home.id,
      }));
    const saveRequest = sequenceBlock(relatedItems).map((block) => saveItems(block));

    await Promise.all(saveRequest);
    console.log(` - ${relatedItems.length} items for ${home.name}.`);
  }
  console.log('');
}
