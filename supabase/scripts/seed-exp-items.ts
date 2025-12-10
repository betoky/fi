import data from '../data/expenses-items.json';
import { getHomes } from '../lib/homes';
import { getSupabaseClient } from '../lib/supabase';
import { getCategoriesFor } from './seed-exp-categories';
import { Cat, getCategories } from '../utils/expenses';

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
  unit: string;
  category_id: string;
  home_id: string;
};

async function saveItems(items: ExpItem[]) {
  const { error } = await getSupabaseClient().from('expense_items').insert(items);

  if (error) {
    throw error;
  }
}

export default async function mockExpensesItems() {
  console.log('Seed expenses items');

  const allCategories = getCategories();
  const homes = await getHomes();

  for (const home of homes) {
    const relatedCategories = await getCategoriesFor(home.id);
    const includedCatKeys = getIncludedKeys(relatedCategories, allCategories);
    const relatedCatKeys = Array.from(includedCatKeys.keys());
    const relatedItems = data.filter((i) => relatedCatKeys.includes(i.category));
    const saveRequest = relatedItems
      // Group items to be saved into 20 blocks
      .reduce((blocks, { name, unit, category }) => {
        const item = { name, unit, category_id: includedCatKeys.get(category)!, home_id: home.id };
        const lastBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;
        const isNext = blocks.length === 0 || lastBlock?.length === 20;
        isNext ? blocks.push([item]) : lastBlock?.push(item);
        return blocks;
      }, [] as ExpItem[][])
      .map((block) => saveItems(block));

    await Promise.all(saveRequest);
    console.log(` - ${relatedItems.length} items for ${home.name}.`);
  }
  console.log('');
}
