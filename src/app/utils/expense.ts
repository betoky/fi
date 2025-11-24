import { ItemService } from '../services/expense/item.service';
import { CreateExpenseGroupType } from '../domain/expense-group';

type ExpenseFormType = {
  date: Date;
  description: string | null;
  isGrouped: boolean;
  groupName: string | null;
  groupCategory: string | null;
  items: {
    item: string | null;
    amount: number | null;
    quantity: number | null;
  }[];
};

export const buildExpenses = (
  { items, date, description }: ExpenseFormType,
  homeId: string,
  service: ItemService
) => {
  return items.map(({ amount, item, quantity }) => ({
    amount: amount!,
    article_id: item!,
    quantity: quantity ?? 1,
    home_id: homeId,
    date: date.toISOString(),
    description: description && description.length > 0 ? description : null,
    category_id: service.getCategoryIdOf(item!),
  }));
};

export const buildExpenseGroup = (
  { date, description, groupName, items }: ExpenseFormType,
  service: ItemService
): CreateExpenseGroupType => {
  const categories = new Set<string>();
  const buildItems = items.map(({ amount, item, quantity }) => {
    categories.add(service.getCategoryIdOf(item!));
    return {
      amount: amount!,
      article_id: item!,
      quantity: quantity ?? 1,
    }
  });
  return {
    date: date.toISOString(),
    description: description && description.length > 0 ? description : null,
    name: groupName!,
    items: buildItems,
    categories: Array.from(categories)
  };
};
