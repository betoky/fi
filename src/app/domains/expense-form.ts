import { PriceInfo } from "@/domains/expense-detail";

type ExpenseFormBase = {
  date: Date;
  name?: string;
  description?: string;
}

export type ExpenseFormType = ExpenseFormBase & {
  items: {
    item: { id: number, category_id: number, name: string };
    amount: number;
    quantity: number;
  }[];
};

export type ExpenseFormData  = Omit<ExpenseFormBase, 'name'> & {
  name: string;
  items: (PriceInfo & { article_id: number })[]
}