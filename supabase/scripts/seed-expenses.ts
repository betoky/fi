import expItemsRaw from '../data/expenses-items.json';
import expGroupRaw from '../data/expenses-groups.json';
import { getSupabaseClient } from '../lib/supabase';
import { getRandom, sequenceBlock, shuffle } from '../utils/array';
import { randomExpenseType } from '../utils/expenses';
import { randomDateSeries, randomNumber } from '../utils/random';
import { getExpItems } from './seed-exp-items';

type CreateExpense = {
  date: string;
  article_id: string;
  category_id: string;
  amount: number;
  home_id: string;
  quantity: number;
};

type GroupItem = {
  amount: number;
  article_id: string;
  quantity: number;
};

type ExpGroup = {
  date: Date;
  name: string;
  items: GroupItem[];
  categories: string[];
  home_id: string;
};

async function saveExpenses(expenses: CreateExpense[]) {
  const { error } = await getSupabaseClient().from('expenses').insert(expenses);
  if (error) throw error;
}

async function saveExpGroup({ categories, date, home_id, items, name }: ExpGroup) {
  const supabase = getSupabaseClient();
  const { data: group, error } = await supabase
    .from('expense_groups')
    .insert({
      date: date.toISOString(),
      home_id,
      name,
      total: items.reduce((sum, { amount }) => sum + amount, 0),
      count: items.length,
    })
    .select('id');

  if (error) throw error;

  const saveGroupCategories = supabase.from('expense_groups_categories').insert(
    categories.map((category_id) => ({
      category_id,
      group_id: group[0].id,
      home_id,
    }))
  );
  
  const saveitems = supabase.from('expense_grouped').insert(
    items.map(({amount, article_id, quantity}) => ({
      amount,
      article_id,
      group_id: group[0].id,
      home_id,
      quantity
    }))
  );

  await Promise.all([saveGroupCategories, saveitems]);
}

type MinMax = {
  min: number;
  max: number;
};

function randomGroup(
  date: Date,
  home_id: string,
  ownItems: { id: string; category_id: string; name: string }[],
  rawMapById: Map<string, { prices: MinMax; quantities: MinMax; name: string; unit: string | null }>
): ExpGroup {
  let groupName: string | undefined = undefined;
  let relatedItems = [] as GroupItem[];
  const categories = [] as string[];

  do {
    const randIndex = Math.floor(Math.random() * expGroupRaw.length);
    const { articles, name } = shuffle(expGroupRaw)[randIndex];
    articles.forEach((id) => {
      const { name: articleName, prices, quantities, unit } = rawMapById.get(id)!;

      const found = ownItems.find((e) => e.name === articleName);
      if (!found) return;

      const randomPrice = randomNumber(prices.min, prices.max, 2);
      const quantity = unit ? randomNumber(quantities.min, quantities.max) : 1;

      groupName = name;
      categories.push(found.category_id);
      relatedItems.push({
        article_id: found.id,
        amount: randomPrice * quantity,
        quantity,
      });
    });
  } while (!groupName || relatedItems.length === 0);

  return { date, name: groupName, items: relatedItems, categories, home_id };
}

function randomSimpleExp(
  date: Date,
  homeId: string,
  ownItems: { id: string; category_id: string; name: string }[],
  rawMapByName: Map<string, { prices: MinMax; quantities: MinMax; unit: string | null }>,
  maxItems = 8
): CreateExpense[] {
  const n = Math.floor(Math.random() * maxItems) + 1;
  const randomItems = getRandom(ownItems, 1, n);

  return randomItems.map(({ id, category_id, name }) => {
    const { prices, quantities, unit } = rawMapByName.get(name)!;
    const randomPrice = randomNumber(prices.min, prices.max, 2);
    const quantity = unit ? randomNumber(quantities.min, quantities.max) : 1;
    return {
      article_id: id,
      category_id,
      home_id: homeId,
      date: date.toISOString(),
      amount: randomPrice * quantity,
      quantity,
    };
  });
}

export default async function mockExpenses(homes: { id: string; name: string }[]) {
  console.log('Seed expenses');
  const expItemsRawMapById = new Map<
    string,
    { prices: MinMax; quantities: MinMax; name: string; unit: string | null }
  >();
  const expItemsRawMapByName = new Map<
    string,
    { prices: MinMax; quantities: MinMax; unit: string | null }
  >();

  expItemsRaw.forEach(({ id, name, prices, quantities, unit }) => {
    expItemsRawMapById.set(id, { prices, quantities, unit, name });
    expItemsRawMapByName.set(name, { prices, quantities, unit });
  });

  for (const home of homes) {
    const ownItems = await getExpItems(home.id);
    const intervals = randomDateSeries(new Date());

    const groupExpenses = [] as ExpGroup[];
    const simpleExpenses = [] as CreateExpense[][];

    for (const date of intervals) {
      if (randomExpenseType() === 'G') {
        groupExpenses.push(randomGroup(date, home.id, ownItems, expItemsRawMapById));
        if (randomExpenseType() === 'S') {
          // can have both simple and group exp for the same date
          simpleExpenses.push(randomSimpleExp(date, home.id, ownItems, expItemsRawMapByName, 3));
        }
      } else {
        simpleExpenses.push(randomSimpleExp(date, home.id, ownItems, expItemsRawMapByName, 15));
      }
    }

    for (const sequence of sequenceBlock(simpleExpenses)) {
      const simpleExpRequest = sequence.map((block) => saveExpenses(block));
      await Promise.all(simpleExpRequest);
    }

    for (const sequence of sequenceBlock(groupExpenses)) {
      const groupExpRequest = sequence.map(group => saveExpGroup(group));
      await Promise.all(groupExpRequest);
    }

    console.log(
      ` - ${simpleExpenses.flat().length + groupExpenses.length} expenses for ${home.name}.`
    );
  }
}
