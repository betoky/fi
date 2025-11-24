import { Tables } from '../../../database.types';
import { ExpenseItemType } from './expense-item';
import { DatabaseProperties } from './utils';

export type ExpenseType = Tables<'expenses'>;

export type ExpenseArticleType = ExpenseType & { article: ExpenseItemType }

export type CreateExpenseType = Omit<ExpenseType, DatabaseProperties>;

export type UpdateExpenseType = Omit<ExpenseType, DatabaseProperties | 'home_id' | 'date' | 'article_id' | 'category_id'>;

export const isExpense = (object: unknown): object is ExpenseArticleType =>
  object !== null &&
  typeof object === 'object' &&
  'id' in object &&
  typeof object['id'] === 'string' &&
  'date' in object &&
  typeof object['date'] === 'string' &&
  'article_id' in object &&
  typeof object['article_id'] === 'string' &&
  'amount' in object &&
  typeof object['amount'] === 'number' &&
  'quantity' in object &&
  typeof object['quantity'] === 'number' &&
  'article' in object &&
  typeof object['article'] === 'object';

