create table "public"."expense_grouped" (
    "id" uuid not null default gen_random_uuid (),
    "article_id" uuid not null,
    "amount" numeric not null,
    "quantity" numeric not null default '1'::numeric,
    "group_id" uuid not null,
    "home_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."expense_grouped" enable row level security;

CREATE UNIQUE INDEX expense_grouped_pkey ON public.expense_grouped USING btree (id);

alter table "public"."expense_grouped"
add constraint "expense_grouped_pkey" PRIMARY KEY using index "expense_grouped_pkey";

alter table "public"."expense_grouped"
add constraint "expense_grouped_home_id_fkey" FOREIGN KEY (home_id) REFERENCES public.homes (id) ON DELETE CASCADE not valid;

alter table "public"."expense_grouped" validate constraint "expense_grouped_home_id_fkey";
