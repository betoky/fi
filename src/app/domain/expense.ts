import { Tables } from '../../../database.types';
import { ExpenseItemType } from './expense-item';

export type ExpenseType = Tables<'expenses'>;

export type CreateExpenseType = Omit<ExpenseType, 'id' | 'created_at'>;

export type UpdateExpenseType = Omit<ExpenseType, 'id' | 'created_at' | 'home_id' | 'date' | 'article_id' | 'group_id'>;

export type ExpenseGroupType = Tables<'expense_groups'>;

export type CreateExpenseGroupType = Omit<ExpenseGroupType, 'id' | 'created_at'>;

export type ExpenseViewType = Omit<
  ExpenseType,
  'home_id' | 'created_at' | 'group_id' | 'article_id'
> & { article: Omit<ExpenseItemType, 'created_at' | 'home_id' | 'id'> };

export type ExpenseViewGroupType = Omit<ExpenseGroupType, 'home_id' | 'created_at'> & {
  items: ExpenseViewType[];
};

export const isExpenseSimpleView = (object: unknown): object is ExpenseViewType =>
  object !== null &&
  typeof object === 'object' &&
  'id' in object &&
  typeof object['id'] === 'string' &&
  'date' in object &&
  typeof object['date'] === 'string' &&
  'amount' in object &&
  typeof object['amount'] === 'number' &&
  'quantity' in object &&
  typeof object['quantity'] === 'number' &&
  'article' in object &&
  object['article'] !== null &&
  typeof object['article'] === 'object';

export const isExpenseViewGroup = (object: unknown): object is ExpenseViewGroupType =>
  object !== null &&
  typeof object === 'object' &&
  'id' in object &&
  typeof object['id'] === 'string' &&
  'name' in object &&
  typeof object['name'] === 'string' &&
  'total' in object &&
  typeof object['total'] === 'number' &&
  'items' in object &&
  Array.isArray(object['items']);
