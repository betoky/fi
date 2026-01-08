import { Tables } from "@/database.types";
import { ExpenseItemType } from "@/domains/expense-item";

export type ExpenseDetail = Tables<'expense_details'> & { article: ExpenseItemType };

export type PriceInfo  = Pick<ExpenseDetail, 'amount' | 'quantity'>;

export type UpdateExpDetail = Partial<PriceInfo >;