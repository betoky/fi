import { ExpenseFormType } from '../domain/expense-form';
import { compareArray } from './object';
import {
  CreateExpenseGroupType,
  ExpGrpItemType,
  UpdateExpenseGroupedType,
  UpdateExpenseGroupType,
} from '../domain/expense-group';

export const buildExpenses = ({ items, date, description }: ExpenseFormType, homeId: string) => {
  return items.map(({ amount, item, quantity }) => ({
    amount: amount!,
    article_id: item!.id,
    quantity: quantity ?? 1,
    home_id: homeId,
    date: date.toISOString(),
    description: description && description.length > 0 ? description : null,
    category_id: item!.category_id,
  }));
};

export const buildExpenseGroup = ({
  date,
  description,
  name,
  items,
}: ExpenseFormType): CreateExpenseGroupType => {
  const categories = new Set<string>();
  const buildItems = items.map(({ amount, item, quantity }) => {
    categories.add(item!.category_id);
    return {
      amount: amount!,
      article_id: item!.id,
      quantity: quantity ?? 1,
    };
  });
  return {
    date: date.toISOString(),
    description: description && description.length > 0 ? description : null,
    name: name!,
    items: buildItems,
    categories: Array.from(categories),
  };
};

export const prepareExpGroupForUpdate = (
  { name, description, items: formItems }: ExpenseFormType,
  groupItems: ExpGrpItemType[]
): UpdateExpenseGroupType => {
  const expGroupedIdsMap = new Map<string, string>();
  const newValueMap = new Map<string, { amount: number; quantity: number }>();

  const currentItems = groupItems.map((i) => {
    expGroupedIdsMap.set(i.article_id, i.id);
    return { articleId: i.article_id, category: i.article.category_id };
  });

  const newItems = formItems.map((i) => {
    newValueMap.set(i.item!.id, { amount: i.amount!, quantity: i.quantity! });
    return { articleId: i.item!.id, category: i.item!.category_id };
  });

  const [kept, missing, added] = compareArray(currentItems, newItems, 'articleId');

  const updateItems: UpdateExpenseGroupedType[] = [];
  for (const { articleId } of kept) {
    const id = expGroupedIdsMap.get(articleId)!;
    updateItems.push({ id, ...newValueMap.get(articleId)! });
  }

  return {
    name: name!,
    description: description && description.length > 0 ? description : null,
    updateItems,
    newCategories: added.map((i) => i.category),
    newItems: added.map((i) => ({ article_id: i.articleId, ...newValueMap.get(i.articleId)! })),
    oldCategories: missing.map((i) => i.category),
    oldItems: missing.map((i) => expGroupedIdsMap.get(i.articleId)!),
  };
};
