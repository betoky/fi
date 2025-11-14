import { Tables } from '../../../database.types';
import { ExpenseItemType } from './expense-item';

export type ExpenseType = Tables<'expenses'>;

export type CreateExpenseType = Omit<ExpenseType, 'id' | 'created_at'>;

export type ExpenseGroupType = Tables<'expense_groups'>;

export type CreateExpenseGroupType = Omit<ExpenseGroupType, 'id' | 'created_at'>;

export type ExpenseViewType = Omit<
  ExpenseType,
  'home_id' | 'created_at' | 'group_id' | 'article_id'
> & { article: Omit<ExpenseItemType, 'created_at' | 'home_id' | 'id'> };

export type ExpenseViewGroupType = Omit<ExpenseGroupType, 'home_id' | 'created_at'> & {
  items: ExpenseViewType[];
};

export const isExpenseViewGroup = (
  category: ExpenseViewType | ExpenseViewGroupType
): category is ExpenseViewGroupType => 'items' in category;
