import { Tables } from '../../../database.types';
import { ExpenseItemType } from './expense-item';
import { DatabaseProperties } from './utils';

export type ExpenseGroupType = Tables<'expense_groups'>;

export type ExpenseGroupedType = Tables<'expense_grouped'>;

export type ExpGrpItemType = ExpenseGroupedType & { article: ExpenseItemType };

type OmittedProperties = DatabaseProperties | 'home_id' | 'count' | 'total';

export type CreateExpenseGroupType = Omit<ExpenseGroupType, OmittedProperties> & {
  items: CreateExpenseGroupedType[];
  categories: string[];
};

export type UpdateExpenseGroupType = Omit<ExpenseGroupType, OmittedProperties | 'date'> & {
  updateItems: UpdateExpenseGroupedType[];
  newItems: CreateExpenseGroupedType[];
  oldItems: string[];
  newCategories: string[];
  oldCategories: string[];
};

export type CreateExpenseGroupedType = Omit<
  ExpenseGroupedType,
  DatabaseProperties | 'home_id' | 'group_id'
>;

export type UpdateExpenseGroupedType = 
  Omit<CreateExpenseGroupedType, 'article_id'> & { id: string };

export const isExpenseGroup = (object: unknown): object is ExpenseGroupType =>
  object !== null &&
  typeof object === 'object' &&
  'id' in object &&
  typeof object['id'] === 'string' &&
  'name' in object &&
  typeof object['name'] === 'string' &&
  'total' in object &&
  typeof object['total'] === 'number';
