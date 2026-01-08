import { Tables } from '@/database.types';
import { ExpenseDetail } from '@/domains/expense-detail';
import { ExpenseItemType } from '@/domains/expense-item';

export type ExpenseType = Tables<'expenses'>;

export type ExpenseArticleType = ExpenseType & { article: ExpenseItemType };

export type UpdateExpenseType = Partial<
  Pick<ExpenseType, 'name' | 'description' | 'amount' | 'count'>
>;

export type EditableExpense = Pick<ExpenseType, 'name' | 'description' | 'amount' | 'count'> & {
  items: ExpenseDetail[];
};
