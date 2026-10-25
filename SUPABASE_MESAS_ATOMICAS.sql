-- Evita que dois computadores sobrescrevam os produtos da mesma mesa.
-- Execute este arquivo uma vez no SQL Editor do Supabase.

create or replace function public.mutate_table_item(
  p_table_id uuid,
  p_action text,
  p_item jsonb default null,
  p_item_key text default null,
  p_change numeric default 0
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  table_row public.bar_tables%rowtype;
  action_name text := lower(trim(coalesce(p_action, '')));
  target_key text := trim(coalesce(p_item_key, ''));
  current_item jsonb;
  current_key text;
  next_items jsonb := '[]'::jsonb;
  matched boolean := false;
  item_quantity numeric;
  next_quantity numeric;
begin
  if auth.uid() is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  select *
  into table_row
  from public.bar_tables
  where id = p_table_id
  for update;

  if not found then
    raise exception 'Mesa nao encontrada.';
  end if;
  if table_row.split_bill is not null then
    raise exception 'Finalize a divisao antes de alterar os produtos desta mesa.';
  end if;
  if table_row.status = 'Fechamento' then
    raise exception 'Esta mesa esta em fechamento no balcao.';
  end if;

  if action_name = 'add' then
    if p_item is null then
      raise exception 'Produto da mesa ausente.';
    end if;
    target_key := coalesce(nullif(target_key, ''), nullif(p_item->>'cartKey', ''), nullif(p_item->>'productId', ''));
    if target_key is null or target_key = '' then
      raise exception 'Identificador do produto ausente.';
    end if;
    item_quantity := greatest(0, coalesce((p_item->>'qty')::numeric, 1));

    for current_item in select value from jsonb_array_elements(coalesce(table_row.items, '[]'::jsonb)) loop
      current_key := coalesce(nullif(current_item->>'cartKey', ''), nullif(current_item->>'productId', ''));
      if current_key = target_key then
        next_quantity := greatest(0, coalesce((current_item->>'qty')::numeric, 0) + item_quantity);
        current_item := jsonb_set(current_item, '{qty}', to_jsonb(next_quantity), true);
        matched := true;
      end if;
      next_items := next_items || jsonb_build_array(current_item);
    end loop;

    if not matched then
      next_items := next_items || jsonb_build_array(p_item || jsonb_build_object('qty', item_quantity));
    end if;
  elsif action_name in ('delta', 'remove') then
    if target_key = '' then
      raise exception 'Identificador do produto ausente.';
    end if;

    for current_item in select value from jsonb_array_elements(coalesce(table_row.items, '[]'::jsonb)) loop
      current_key := coalesce(nullif(current_item->>'cartKey', ''), nullif(current_item->>'productId', ''));
      if current_key = target_key then
        matched := true;
        if action_name = 'delta' then
          next_quantity := coalesce((current_item->>'qty')::numeric, 0) + p_change;
          if next_quantity > 0 then
            current_item := jsonb_set(current_item, '{qty}', to_jsonb(next_quantity), true);
            next_items := next_items || jsonb_build_array(current_item);
          end if;
        end if;
      else
        next_items := next_items || jsonb_build_array(current_item);
      end if;
    end loop;

    if not matched then
      raise exception 'O produto mudou em outro computador. Atualize a mesa e tente novamente.';
    end if;
  else
    raise exception 'Operacao de mesa invalida.';
  end if;

  update public.bar_tables
  set items = next_items,
      status = case when status = 'Livre' then 'Aberta' else status end,
      opened_at = coalesce(opened_at, now()),
      server_id = coalesce(server_id, auth.uid())
  where id = p_table_id;

  return jsonb_build_object(
    'ok', true,
    'tableId', p_table_id,
    'items', next_items
  );
end;
$$;

revoke all on function public.mutate_table_item(uuid, text, jsonb, text, numeric) from public;
grant execute on function public.mutate_table_item(uuid, text, jsonb, text, numeric) to authenticated;

notify pgrst, 'reload schema';
