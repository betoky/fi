-- Homes table creation

create table "public"."homes" (
  "id" uuid not null default gen_random_uuid(),
  "name" character varying not null,
  "created_at" timestamp with time zone not null default now(),
  "owner_id" uuid not null default gen_random_uuid()
);

alter table "public"."homes" enable row level security;

CREATE UNIQUE INDEX homes_owner_id_key ON public.homes USING btree (owner_id);

CREATE UNIQUE INDEX homes_pkey ON public.homes USING btree (id);

alter table "public"."homes" add constraint "homes_pkey" PRIMARY KEY using index "homes_pkey";

alter table "public"."homes" add constraint "homes_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."homes" validate constraint "homes_owner_id_fkey";

alter table "public"."homes" add constraint "homes_owner_id_key" UNIQUE using index "homes_owner_id_key";

grant delete on table "public"."homes" to "authenticated";

grant insert on table "public"."homes" to "authenticated";

grant references on table "public"."homes" to "authenticated";

grant select on table "public"."homes" to "authenticated";

grant trigger on table "public"."homes" to "authenticated";

grant truncate on table "public"."homes" to "authenticated";

grant update on table "public"."homes" to "authenticated";

grant delete on table "public"."homes" to "service_role";

grant insert on table "public"."homes" to "service_role";

grant references on table "public"."homes" to "service_role";

grant select on table "public"."homes" to "service_role";

grant trigger on table "public"."homes" to "service_role";

grant truncate on table "public"."homes" to "service_role";

grant update on table "public"."homes" to "service_role";

create policy "Enable insert for authenticated users only"
  on "public"."homes"
  as permissive
  for insert
  to authenticated
with check (true);

create policy "Enable users to view their own data only"
  on "public"."homes"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = owner_id));


-- Users table creation

create table "public"."users" (
  "id" uuid not null default gen_random_uuid(),
  "auth_id" uuid not null,
  "created_at" timestamp with time zone not null default now(),
  "name" character varying not null
);

alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX users_auth_id_key ON public.users USING btree (auth_id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users" add constraint "users_auth_id_fkey" FOREIGN KEY (auth_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_auth_id_fkey";

alter table "public"."users" add constraint "users_auth_id_key" UNIQUE using index "users_auth_id_key";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Enable insert for authenticated users only"
  on "public"."users"
  as permissive
  for insert
  to authenticated
with check (true);

create policy "Enable users to view their own data only"
  on "public"."users"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = auth_id));