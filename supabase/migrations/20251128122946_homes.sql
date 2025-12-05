create table "public"."homes" (
    "id" uuid not null default gen_random_uuid (),
    "name" character varying not null,
    "created_at" timestamp with time zone not null default now(),
    "owner_id" uuid not null default gen_random_uuid ()
);

alter table "public"."homes" enable row level security;

CREATE UNIQUE INDEX homes_pkey ON public.homes USING btree (id);

alter table "public"."homes"
add constraint "homes_pkey" PRIMARY KEY using index "homes_pkey";

CREATE UNIQUE INDEX homes_owner_id_key ON public.homes USING btree (owner_id);

alter table "public"."homes"
add constraint "homes_owner_id_key" UNIQUE using index "homes_owner_id_key";

alter table "public"."homes"
add constraint "homes_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users (id) ON DELETE CASCADE not valid;

alter table "public"."homes" validate constraint "homes_owner_id_fkey";
