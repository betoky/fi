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