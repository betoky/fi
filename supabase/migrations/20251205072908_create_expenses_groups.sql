set check_function_bodies = off;

create type public.expense_group_item as ("article_id" uuid, "amount" numeric, "quantity" numeric);

CREATE OR REPLACE FUNCTION public.create_expense_group_with_items(p_categories uuid[], p_name character varying, p_description text DEFAULT NULL::text, p_items public.expense_group_item[] DEFAULT NULL::public.expense_group_item[], p_date timestamp with time zone DEFAULT now())
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'pg_temp'
AS $function$
declare
  new_group_id uuid;
  home_id uuid;
  v_total numeric := 0;
  v_items_count int := 0;
begin
  home_id := public.get_request_home();

  if home_id is null then
    raise exception 'Action non autorisée';
  end if;

  if p_items is null then
    raise exception 'Les articles sont requises';
  end if;

  v_items_count := cardinality(p_items);

  if v_items_count = 0 then
    raise exception 'La liste des articles ne peut pas être vide';
  end if;

  perform 1 from unnest(p_items) as i where i.article_id is null;
  if found then
    raise exception 'Tous les articles doivent avoir un article_id non null';
  end if;

  select sum(i.amount) into v_total from unnest(p_items) as i;

  if v_total is null then
    raise exception 'Tous les articles doivent avoir un montant';
  end if;

  insert into public.expense_groups (home_id, name, description, date, total, count
  ) values (
    home_id,
    p_name,
    p_description,
    p_date,
    v_total,
    v_items_count
  )
  returning id into new_group_id;

  insert into public.expense_grouped (group_id, home_id, article_id, amount, quantity)
  select
    new_group_id,
    home_id,
    item.article_id,
    item.amount,
    coalesce(nullif(item.quantity, 0), 1)
  from unnest(p_items) as item;

  insert into public.expense_groups_categories (group_id, category_id, home_id)
    select new_group_id, unnest(p_categories), home_id;

  return new_group_id;

exception when others then
  raise;
end;
$function$;

grant
execute on function create_expense_group_with_items (
    uuid [],
    varchar,
    text,
    expense_group_item[],
    timestamptz
) to authenticated;