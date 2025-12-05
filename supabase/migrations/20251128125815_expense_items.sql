create table "public"."expense_items" (
    "id" uuid not null default gen_random_uuid (),
    "name" character varying not null,
    "unit" character varying,
    "home_id" uuid not null default gen_random_uuid (),
    "created_at" timestamp with time zone not null default now(),
    "category_id" uuid not null
);

alter table "public"."expense_items" enable row level security;

CREATE UNIQUE INDEX articles_pkey ON public.expense_items USING btree (id);

alter table "public"."expense_items"
add constraint "articles_pkey" PRIMARY KEY using index "articles_pkey";

alter table "public"."expense_items"
add constraint "articles_home_id_fkey" FOREIGN KEY (home_id) REFERENCES public.homes (id) ON DELETE CASCADE not valid;

alter table "public"."expense_items" validate constraint "articles_home_id_fkey";

alter table "public"."expense_items"
add constraint "expense_items_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.expense_categories (id) ON DELETE CASCADE not valid;

alter table "public"."expense_items" validate constraint "expense_items_category_id_fkey";

alter table "public"."expense_grouped"
add constraint "expense_grouped_article_id_fkey" FOREIGN KEY (article_id) REFERENCES public.expense_items (id) ON DELETE CASCADE not valid;

alter table "public"."expense_grouped" validate constraint "expense_grouped_article_id_fkey";
