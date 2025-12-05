create table "public"."expense_categories" (
    "id" uuid not null default gen_random_uuid (),
    "name" character varying not null,
    "created_at" timestamp with time zone not null default now(),
    "parent" uuid,
    "home_id" uuid not null
);

alter table "public"."expense_categories" enable row level security;

CREATE UNIQUE INDEX expense_categories_pkey ON public.expense_categories USING btree (id);

alter table "public"."expense_categories"
add constraint "expense_categories_pkey" PRIMARY KEY using index "expense_categories_pkey";

alter table "public"."expense_categories"
add constraint "expense_categories_home_id_fkey" FOREIGN KEY (home_id) REFERENCES public.homes (id) ON DELETE CASCADE not valid;

alter table "public"."expense_categories" validate constraint "expense_categories_home_id_fkey";

alter table "public"."expense_categories"
add constraint "expense_categories_parent_fkey" FOREIGN KEY (parent) REFERENCES public.expense_categories (id) ON DELETE CASCADE not valid;

alter table "public"."expense_categories" validate constraint "expense_categories_parent_fkey";
