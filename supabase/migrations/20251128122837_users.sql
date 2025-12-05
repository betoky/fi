create table "public"."users" (
    "id" uuid not null default gen_random_uuid (),
    "auth_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "name" character varying not null
);

alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."users"
add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

CREATE UNIQUE INDEX users_auth_id_key ON public.users USING btree (auth_id);

alter table "public"."users"
add constraint "users_auth_id_key" UNIQUE using index "users_auth_id_key";

alter table "public"."users"
add constraint "users_auth_id_fkey" FOREIGN KEY (auth_id) REFERENCES auth.users (id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_auth_id_fkey";
