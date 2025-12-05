create table "public"."expense_groups" (
    "id" uuid not null default gen_random_uuid (),
    "name" character varying not null,
    "description" text,
    "created_at" timestamp with time zone not null default now(),
    "total" numeric not null,
    "home_id" uuid not null,
    "date" timestamp with time zone not null,
    "count" smallint not null default '0'::smallint
);

alter table "public"."expense_groups" enable row level security;

CREATE UNIQUE INDEX expense_groups_pkey ON public.expense_groups USING btree (id);

alter table "public"."expense_groups"
add constraint "expense_groups_pkey" PRIMARY KEY using index "expense_groups_pkey";

alter table "public"."expense_groups"
add constraint "expense_groups_home_id_fkey" FOREIGN KEY (home_id) REFERENCES public.homes (id) ON DELETE CASCADE not valid;

alter table "public"."expense_groups" validate constraint "expense_groups_home_id_fkey";

alter table "public"."expense_grouped"
add constraint "expense_grouped_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.expense_groups (id) ON DELETE CASCADE not valid;

alter table "public"."expense_grouped" validate constraint "expense_grouped_group_id_fkey";
