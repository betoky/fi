create table "public"."expenses" (
    "id" uuid not null default gen_random_uuid (),
    "date" timestamp with time zone not null,
    "article_id" uuid not null,
    "amount" numeric not null,
    "quantity" numeric not null,
    "description" text,
    "home_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "category_id" uuid
);

alter table "public"."expenses" enable row level security;

CREATE UNIQUE INDEX expenses_pkey ON public.expenses USING btree (id);

alter table "public"."expenses"
add constraint "expenses_pkey" PRIMARY KEY using index "expenses_pkey";

alter table "public"."expenses"
add constraint "expenses_home_id_fkey" FOREIGN KEY (home_id) REFERENCES public.homes (id) ON DELETE CASCADE not valid;

alter table "public"."expenses" validate constraint "expenses_home_id_fkey";

alter table "public"."expenses"
add constraint "expenses_article_id_fkey" FOREIGN KEY (article_id) REFERENCES public.expense_items (id) ON DELETE CASCADE not valid;

alter table "public"."expenses" validate constraint "expenses_article_id_fkey";

alter table "public"."expenses"
add constraint "expenses_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.expense_categories (id) ON DELETE SET NULL not valid;

alter table "public"."expenses" validate constraint "expenses_category_id_fkey";
