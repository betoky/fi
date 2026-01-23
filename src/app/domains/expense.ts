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

export type ExpFetchParams = {
  type: 'all' | 'group' | 'simple';
  cursor?: Date | null;
  keyword?: string;
  categories?: {
    ids: number[];
    cursor?: number | null;
  };
  date?: {
    min: Date;
    max: Date;
  };
  amount?: {
    min?: number;
    max?: number;
  }
  order?: {
    field: 'category' | 'amount' | 'date';
    ascending: boolean;
  };
  limit?: number;
};

export type ExpenseFilter = {
  type?: ExpFetchParams['type'];
  date?: Date | [Date, Date];
  amount?: ExpFetchParams['amount'];
  categorieIds?: number[];
  order?: ExpFetchParams['order'];
}