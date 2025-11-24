import { Tables } from '../../../database.types';
import { DatabaseProperties } from './utils';

export type ExpenseGroupType = Tables<'expense_groups'>;

export type ExpenseGroupedType = Tables<'expense_grouped'>;

export type CreateExpenseGroupType = Omit<ExpenseGroupType, DatabaseProperties | 'home_id' | 'count' | 'total'> & {
  items: CreateExpenseGroupedType[];
  categories: string[];
};

export type UpdateExpenseGroupType = Partial<CreateExpenseGroupType>;

export type CreateExpenseGroupedType = Omit<
  ExpenseGroupedType,
  DatabaseProperties | 'home_id' | 'group_id'
>;

export type UpdateExpenseGroupedType = Partial<
  Omit<CreateExpenseGroupedType, 'home_id' | 'article_id'>
>;

export const isExpenseGroup = (object: unknown): object is ExpenseGroupType =>
  object !== null &&
  typeof object === 'object' &&
  'id' in object &&
  typeof object['id'] === 'string' &&
  'name' in object &&
  typeof object['name'] === 'string' &&
  'total' in object &&
  typeof object['total'] === 'number';
