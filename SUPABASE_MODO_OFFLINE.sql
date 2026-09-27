-- Sincronizacao atomica das vendas registradas durante uma queda de internet.
-- Execute uma vez no SQL Editor do Supabase.

create or replace function public.sync_offline_sale(payload jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  sale_uuid uuid;
  cashier_uuid uuid;
  client_uuid uuid;
  table_uuid uuid;
  item jsonb;
  item_uuid uuid;
  product_uuid uuid;
  item_quantity numeric(12,3);
  kitchen_order jsonb;
  transaction_data jsonb;
  fiado_amount numeric(12,2);
begin
  if auth.uid() is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  sale_uuid := nullif(payload->>'saleId', '')::uuid;
  if sale_uuid is null then
    raise exception 'Identificador da venda offline ausente.';
  end if;

  if exists (select 1 from public.sales where id = sale_uuid) then
    return jsonb_build_object('ok', true, 'already_synced', true, 'sale_id', sale_uuid);
  end if;

  cashier_uuid := nullif(payload->>'cashierId', '')::uuid;
  if cashier_uuid is null or not exists (select 1 from public.profiles where id = cashier_uuid) then
    cashier_uuid := auth.uid();
  end if;
  client_uuid := nullif(payload->>'clientId', '')::uuid;
  table_uuid := nullif(payload->>'tableId', '')::uuid;
  fiado_amount := greatest(0, coalesce((payload->>'fiadoAmount')::numeric, 0));
  if fiado_amount > 0 and (client_uuid is null or not exists (select 1 from public.clients where id = client_uuid)) then
    raise exception 'Cliente da venda fiado nao foi encontrado.';
  end if;

  insert into public.sales (
    id,
    cashier_id,
    client_id,
    table_id,
    payment,
    status,
    service_fee,
    total,
    cost,
    created_at
  ) values (
    sale_uuid,
    cashier_uuid,
    case when fiado_amount > 0 then client_uuid else null end,
    table_uuid,
    coalesce(nullif(payload->>'payment', ''), 'Indefinido'),
    'Concluida',
    coalesce((payload->>'serviceFee')::numeric, 0),
    coalesce((payload->>'total')::numeric, 0),
    coalesce((payload->>'cost')::numeric, 0),
    coalesce((payload->>'date')::timestamptz, now())
  );

  for item in select value from jsonb_array_elements(coalesce(payload->'items', '[]'::jsonb))
  loop
    item_uuid := coalesce(nullif(item->>'syncId', '')::uuid, gen_random_uuid());
    product_uuid := nullif(item->>'productId', '')::uuid;
    item_quantity := greatest(0, coalesce((item->>'qty')::numeric, 0));
    if product_uuid is not null and not exists (select 1 from public.products where id = product_uuid) then
      product_uuid := null;
    end if;

    insert into public.sale_items (id, sale_id, product_id, name, qty, price, cost)
    values (
      item_uuid,
      sale_uuid,
      product_uuid,
      coalesce(nullif(item->>'name', ''), 'Produto'),
      item_quantity,
      coalesce((item->>'price')::numeric, 0),
      coalesce((item->>'cost')::numeric, 0)
    )
    on conflict (id) do nothing;

    if product_uuid is not null then
      if exists (select 1 from public.product_recipes where product_id = product_uuid) then
        update public.ingredients as ingredient
        set stock = greatest(0, ingredient.stock - recipe.qty * item_quantity)
        from public.product_recipes as recipe
        where recipe.product_id = product_uuid
          and recipe.ingredient_id = ingredient.id;
      else
        update public.products
        set stock = greatest(0, stock - item_quantity)
        where id = product_uuid;
      end if;
    end if;
  end loop;

  for kitchen_order in select value from jsonb_array_elements(coalesce(payload->'kitchenOrders', '[]'::jsonb))
  loop
    insert into public.kitchen_orders (id, sale_id, station, status, items, user_id, created_at)
    values (
      coalesce(nullif(kitchen_order->>'id', '')::uuid, gen_random_uuid()),
      sale_uuid,
      coalesce(nullif(kitchen_order->>'station', ''), 'Cozinha'),
      coalesce(nullif(kitchen_order->>'status', ''), 'Novo'),
      coalesce(kitchen_order->'items', '[]'::jsonb),
      cashier_uuid,
      coalesce((kitchen_order->>'date')::timestamptz, now())
    )
    on conflict (id) do nothing;
  end loop;

  transaction_data := payload->'clientTransaction';
  if fiado_amount > 0 and client_uuid is not null then
    update public.clients
    set debt = debt + fiado_amount
    where id = client_uuid;

    if transaction_data is not null and transaction_data <> 'null'::jsonb then
      insert into public.client_transactions (
        id,
        client_id,
        sale_id,
        user_id,
        type,
        description,
        amount,
        created_at
      ) values (
        coalesce(nullif(transaction_data->>'id', '')::uuid, gen_random_uuid()),
        client_uuid,
        sale_uuid,
        cashier_uuid,
        'debito',
        coalesce(nullif(transaction_data->>'description', ''), 'Venda fiado offline'),
        fiado_amount,
        coalesce((transaction_data->>'date')::timestamptz, now())
      )
      on conflict (id) do nothing;
    end if;
  end if;

  if table_uuid is not null then
    update public.bar_tables
    set status = 'Livre',
        opened_at = null,
        server_id = null,
        client_id = null,
        customer_name = '',
        items = '[]'::jsonb
    where id = table_uuid;
  end if;

  return jsonb_build_object('ok', true, 'already_synced', false, 'sale_id', sale_uuid);
end;
$$;

revoke all on function public.sync_offline_sale(jsonb) from public;
grant execute on function public.sync_offline_sale(jsonb) to authenticated;

notify pgrst, 'reload schema';
