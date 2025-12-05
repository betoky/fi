set check_function_bodies = off;

create type public.update_exp_groupd_item as (id uuid, amount numeric, quantity numeric);

create or replace function public.update_expense_group_with_items (
  p_id              uuid,
  p_new_categories   uuid[]               default null,
  p_old_categories   uuid[]               default null,
  p_old_items        uuid[]               default null,
  p_new_items        expense_group_item[] default null,
  p_update_items     update_exp_groupd_item[] default null,
  p_name            varchar             default null,
  p_description     text                 default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$

declare
  v_home_id uuid;
  v_total numeric;
  v_count integer;
  i       integer;

begin

  v_home_id := public.get_request_home();
  if v_home_id is null then
    raise exception 'Action non autorisée';
  end if;

  perform 1 from public.expense_groups
  where id = p_id and home_id = v_home_id;
  if not found then
    raise exception 'Groupe de dépenses introuvable ou accès refusé';
  end if;

  -- Delete old categories
  if p_old_categories is not null and cardinality(p_old_categories) > 0 then
    delete from public.expense_groups_categories
    where group_id = p_id and category_id = any(p_old_categories);
  end if;

  -- Insert new categories
  if p_new_categories is not null and cardinality(p_new_categories) > 0 then
    insert into public.expense_groups_categories (group_id, category_id, home_id)
    select p_id, unnest(p_new_categories), v_home_id;
  end if;

  -- Delete old items
  if p_old_items is not null and cardinality(p_old_items) > 0 then
    delete from public.expense_grouped
    where id = any(p_old_items) and group_id = p_id;
  end if;

  -- Update already exist items
  if p_update_items is not null and cardinality(p_update_items) > 0 then
    for i in 1..cardinality(p_update_items) loop
      update public.expense_grouped
      set
        amount   = coalesce(p_update_items[i].amount,   amount),
        quantity = coalesce(p_update_items[i].quantity, quantity)
      where id = p_update_items[i].id and group_id = p_id;
    end loop;
  end if;

  -- Insert new items
  if p_new_items is not null and cardinality(p_new_items) > 0 then
    perform 1 from unnest(p_new_items) as ni where ni.article_id is null;
    if found then
      raise exception 'Tous les nouveaux articles doivent avoir un article_id';
    end if;

    insert into public.expense_grouped (group_id, home_id, article_id, amount, quantity)
    select
      p_id,
      v_home_id,
      ni.article_id,
      ni.amount,
      coalesce(nullif(ni.quantity, 0), 1)
    from unnest(p_new_items) as ni;
  end if;

  -- Update total amount and count items
  select coalesce(sum(amount), 0), count(*)
  into v_total, v_count
  from public.expense_grouped
  where group_id = p_id;

  -- Update group table
  update public.expense_groups
  set
    name        = coalesce(p_name,        name),
    description = p_description,
    total       = v_total,
    count       = v_count
  where id = p_id;

  return p_id;

exception when others then
  raise;
end;
$$;

grant
execute on function update_expense_group_with_items (
    uuid,
    uuid [],
    uuid [],
    uuid [],
    expense_group_item[],
    update_exp_groupd_item[],
    varchar,
    text
) to authenticated;