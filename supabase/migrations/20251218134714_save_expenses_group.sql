set check_function_bodies = off;

create type public.exp_input_item as (
  "article_id" bigint,
  "amount" numeric,
  "quantity" numeric
);

CREATE OR REPLACE FUNCTION public.save_expenses_as_group(
  p_name character varying,
  p_items exp_input_item[],
  p_date timestamp with time zone DEFAULT now(),
  p_description text DEFAULT NULL::text)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'pg_temp'
AS $function$
declare
  v_home_id uuid;
  v_exp_id public.expenses.id%TYPE;
  v_total numeric := 0;
  v_count int := 0;
  v_category_id public.expense_items.category_id%TYPE;
  v_iteration public.exp_input_item;
begin
  v_home_id := public.get_request_home();
  if v_home_id is null then
    raise exception 'Action non autorisée';
  end if;

  v_count := cardinality(p_items);
  if v_count = 0 then
    raise exception 'La liste des articles ne peut pas être vide';
  end if;

  select sum(i.amount) into v_total from unnest(p_items) as i;
  if v_total is null then
    raise exception 'Tous les articles doivent avoir un montant';
  end if;

  insert into public.expenses (
    date, name, amount, description, count, as_group, home_id
  ) values (
    p_date, p_name, v_total, p_description, v_count, true, v_home_id
  )
  returning id into v_exp_id;

  for v_iteration in
  select * from unnest(p_items) as v_iteration
  loop
    select category_id into strict v_category_id
    from public.expense_items
    where id = v_iteration.article_id and home_id = v_home_id;

    insert into public.expense_details (
      article_id, amount, quantity, expense_id, home_id
    ) values (
      v_iteration.article_id, v_iteration.amount, v_iteration.quantity, v_exp_id, v_home_id
    );

    insert into public.expenses_categories (expense_id, category_id, home_id)
    values (v_exp_id, v_category_id, v_home_id)
    on conflict (expense_id, category_id, home_id) do nothing;
  end loop;

  return v_exp_id;

  exception when others then raise;
end;
$function$;

grant execute on function save_expenses_as_group to authenticated;