create type "public"."Currency" as enum ('MGA', 'EUR', 'USD');

create table "public"."homes" (
    "id" uuid not null default gen_random_uuid (),
    "name" character varying not null,
    "currency" public."Currency" not null,
    "owner_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
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

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_request_home()
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'pg_catalog', 'pg_temp'
AS $function$
DECLARE
  result uuid;
BEGIN
  SELECT id
  INTO result
  FROM public.homes
  WHERE owner_id = (SELECT auth.uid())
  LIMIT 1;

  RETURN result;
END;
$function$
;

create policy "Only the owner has control of their home" on "public"."homes" as permissive for all to authenticated using (
    (
        owner_id = (
            SELECT auth.uid () AS uid
        )
    )
);
