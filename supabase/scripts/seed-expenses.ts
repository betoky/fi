import expItemsRaw from '../data/expenses-items.json';
import expGroupRaw from '../data/expenses-groups.json';
import { getSupabaseClient } from '../lib/supabase';
import { getRandom, sequenceBlock, shuffle } from '../utils/array';
import { randomExpenseType } from '../utils/expenses';
import { randomDateSeries, randomNumber } from '../utils/random';
import { getExpItems } from './seed-exp-items';
import { Tables } from '../../database.types';

type ExpenseType = Tables<'expenses'>;

type CreateExpense = Omit<ExpenseType, 'id' | 'created_at' | 'description'>;

type CreateSimpleExp = Omit<CreateExpense, 'count'> & {
  article_id: number;
  category_id: number;
  quantity: number | null;
};

type InputItem = {
  amount: number;
  article_id: number;
  quantity: number;
};

type ExpGroup = {
  date: Date;
  name: string;
  items: InputItem[];
  categories: number[];
  home_id: string;
};

async function saveExpSimple(exp: CreateSimpleExp) {
  const { category_id, quantity, article_id, ...data } = exp;
  const supabase = getSupabaseClient();
  const { data: expense, error } = await supabase
    .from('expenses')
    .insert(data)
    .select('id')
    .single();

  if (error) throw error;

  const expense_id = expense.id;
  const { as_group, ...details } = data;

  await Promise.all([
    supabase
      .from('expense_details')
      .insert({ expense_id, quantity: quantity ?? undefined, article_id, ...details }),
    supabase
      .from('expenses_categories')
      .insert({ category_id, expense_id, home_id: details.home_id })
  ])
}

async function saveExpGroup({ categories, date, home_id, items, name }: ExpGroup) {
  const supabase = getSupabaseClient();
  const { data: expense, error } = await supabase
    .from('expenses')
    .insert({
      date: date.toISOString(),
      home_id,
      name,
      amount: items.reduce((sum, { amount }) => sum + amount, 0),
      count: items.length,
      as_group: true,
    })
    .select('id')
    .single();

  if (error) throw error;

  await Promise.all([
    supabase.from('expense_details').insert(
      items.map(({ amount, article_id, quantity }) => ({
        amount,
        article_id,
        expense_id: expense.id,
        home_id,
        quantity,
      }))
    ),
    supabase.from('expenses_categories').insert(
      categories.map((category_id) => ({
        category_id,
        expense_id: expense.id,
        home_id,
      }))
    )
  ]);
}

type MinMax = {
  min: number;
  max: number;
};

function randomGroup(
  date: Date,
  home_id: string,
  ownItems: { id: number; category_id: number; name: string }[],
  rawMapById: Map<string, { prices: MinMax; quantities: MinMax; name: string; unit: string | null }>
): ExpGroup {
  let groupName: string | undefined = undefined;
  let relatedItems = [] as InputItem[];
  const categories = [] as number[];

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
  ownItems: { id: number; category_id: number; name: string }[],
  rawMapByName: Map<string, { prices: MinMax; quantities: MinMax; unit: string | null }>,
  maxItems = 8
): CreateSimpleExp[] {
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
      name,
      date: date.toISOString(),
      amount: randomPrice * quantity,
      quantity,
      as_group: false,
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
    const simpleExpenses = [] as CreateSimpleExp[][];

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

    for (const sequence of sequenceBlock(simpleExpenses.flat())) {
      const simpleExpRequest = sequence.map((block) => saveExpSimple(block));
      await Promise.all(simpleExpRequest);
    }

    for (const sequence of sequenceBlock(groupExpenses)) {
      const groupExpRequest = sequence.map((group) => saveExpGroup(group));
      await Promise.all(groupExpRequest);
    }

    console.log(
      ` - ${simpleExpenses.flat().length + groupExpenses.length} expenses for ${home.name}.`
    );
  }
}
