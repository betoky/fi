set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_expenses_summary(p_date timestamp with time zone, p_mode text)
 RETURNS TABLE(id bigint, category character varying, total numeric, parent bigint)
 LANGUAGE plpgsql
 SET search_path TO 'pg_catalog', 'pg_temp'
AS $function$
begin
  if p_mode not in ('day','week','month','year') then
    raise exception 'Invalid p_mode: %', p_mode;
  end if;
  return query
  select parent.id as id, parent.name as category, sum(exp.amount) as total, parent.parent as parent
  from public.expenses_categories exp_cat
  join public.expense_categories child
    on exp_cat.category_id = child.id
  left join public.expense_categories parent
    on parent.id = child.parent or parent.id = child.id
  left join public.expenses exp
    on exp_cat.expense_id = exp.id
  where date_trunc(p_mode, exp.date) = date_trunc(p_mode, p_date)
  group by parent.id, parent.name, parent.parent;
end;
$function$;