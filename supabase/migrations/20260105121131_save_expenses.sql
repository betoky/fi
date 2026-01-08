set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.save_expenses(
  p_items exp_input_item[],
  p_date timestamp with time zone DEFAULT now(),
  p_description text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'pg_temp'
AS $function$
declare
  v_home_id uuid;
  v_exp_id public.expenses.id%TYPE;
  v_category_id public.expense_items.category_id%TYPE;
  v_iteration public.exp_input_item;
  v_article_name public.expense_items.name%TYPE;
begin
  v_home_id := public.get_request_home();
  if v_home_id is null then
    raise exception 'Action non autorisée';
  end if;

  for v_iteration in
  select * from unnest(p_items) as v_iteration
  loop
    select category_id, name
    into strict v_category_id, v_article_name
    from public.expense_items
    where id = v_iteration.article_id and home_id = v_home_id;

    insert into public.expenses (
      date, name, amount, description, count, home_id
    ) values (
      p_date, v_article_name, v_iteration.amount, p_description, v_iteration.quantity, v_home_id
    )
    returning id into v_exp_id;

    insert into public.expense_details (
      article_id, amount, quantity, expense_id, home_id
    ) values (
      v_iteration.article_id, v_iteration.amount, v_iteration.quantity, v_exp_id, v_home_id
    );

    insert into public.expenses_categories (expense_id, category_id, home_id)
    values (v_exp_id, v_category_id, v_home_id)
    on conflict (expense_id, category_id, home_id) do nothing;
  end loop;

  exception when others then raise;
end;
$function$;

grant execute on function save_expenses to authenticated;