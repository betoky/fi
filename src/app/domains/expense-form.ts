export type ExpenseFormType = {
  date: Date;
  description: string | null;
  name: string | null;
  items: {
    item?: { id: string, category_id: string, name: string } | null;
    amount?: number | null;
    quantity?: number | null;
  }[];
};