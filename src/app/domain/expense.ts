import { Tables } from "../../../database.types";

export type ExpenseType = Tables<'expenses'>;

export type CreateExpenseType = Omit<ExpenseType, 'id' | 'created_at'>;

export type ExpenseGroupType = Tables<'expense_groups'>;

export type CreateExpenseGroupType = Omit<ExpenseGroupType, 'id' | 'created_at'>;