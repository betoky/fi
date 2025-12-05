create table "public"."expense_groups_categories" (
    "group_id" uuid not null,
    "category_id" uuid not null,
    "home_id" uuid not null
);

alter table "public"."expense_groups_categories" enable row level security;

CREATE UNIQUE INDEX expense_groups_categories_pkey ON public.expense_groups_categories USING btree (group_id, category_id);

alter table "public"."expense_groups_categories"
add constraint "expense_groups_categories_pkey" PRIMARY KEY using index "expense_groups_categories_pkey";

alter table "public"."expense_groups_categories"
add constraint "expense_groups_categories_home_id_fkey" FOREIGN KEY (home_id) REFERENCES public.homes (id) ON DELETE CASCADE not valid;

alter table "public"."expense_groups_categories" validate constraint "expense_groups_categories_home_id_fkey";

alter table "public"."expense_groups_categories"
add constraint "expense_groups_categories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.expense_categories (id) ON DELETE CASCADE not valid;

alter table "public"."expense_groups_categories" validate constraint "expense_groups_categories_category_id_fkey";

alter table "public"."expense_groups_categories"
add constraint "expense_groups_categories_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.expense_groups (id) ON DELETE CASCADE not valid;

alter table "public"."expense_groups_categories" validate constraint "expense_groups_categories_group_id_fkey";
