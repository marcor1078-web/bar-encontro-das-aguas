-- Divisao de contas por pessoa, bloqueio contra cobranca duplicada e
-- sincronizacao atomica da venda. Execute uma vez no SQL Editor do Supabase.

alter table public.bar_tables
  add column if not exists split_bill jsonb;

create or replace function public.claim_table_split_payment(
  p_table_id uuid,
  p_split_bill_id text,
  p_person_id text,
  p_claim_id text
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  bill jsonb;
  person jsonb;
  person_index integer;
  claimed_at timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  select split_bill into bill
  from public.bar_tables
  where id = p_table_id
  for update;

  if bill is null or coalesce(bill->>'id', '') <> p_split_bill_id then
    raise exception 'A divisao desta mesa foi alterada. Atualize o aplicativo.';
  end if;

  select value, ordinality::integer - 1
  into person, person_index
  from jsonb_array_elements(coalesce(bill->'people', '[]'::jsonb)) with ordinality
  where value->>'id' = p_person_id
  limit 1;

  if person is null then
    raise exception 'Parte da conta nao encontrada.';
  end if;
  if person->>'status' = 'paid' then
    raise exception 'Esta parte da conta ja foi paga.';
  end if;
  if person->>'status' = 'processing' and coalesce(person->>'claimId', '') <> p_claim_id then
    begin
      claimed_at := nullif(person->>'claimedAt', '')::timestamptz;
    exception when others then
      claimed_at := now();
    end;
    if claimed_at is null or claimed_at > now() - interval '15 minutes' then
      raise exception 'Esta parte esta sendo recebida em outro atendimento.';
    end if;
  end if;

  person := person || jsonb_build_object(
    'status', 'processing',
    'claimId', p_claim_id,
    'claimedAt', now()::text,
    'claimedBy', auth.uid()::text
  );
  bill := jsonb_set(bill, array['people', person_index::text], person, false);

  update public.bar_tables
  set split_bill = bill,
      status = 'Fechamento',
      server_id = auth.uid()
  where id = p_table_id;

  return jsonb_build_object('ok', true, 'split_bill', bill, 'person', person);
end;
$$;

create or replace function public.release_table_split_payment(
  p_table_id uuid,
  p_split_bill_id text,
  p_person_id text,
  p_claim_id text
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  bill jsonb;
  person jsonb;
  person_index integer;
begin
  if auth.uid() is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  select split_bill into bill
  from public.bar_tables
  where id = p_table_id
  for update;

  if bill is null or coalesce(bill->>'id', '') <> p_split_bill_id then
    return jsonb_build_object('ok', false, 'reason', 'split_changed');
  end if;

  select value, ordinality::integer - 1
  into person, person_index
  from jsonb_array_elements(coalesce(bill->'people', '[]'::jsonb)) with ordinality
  where value->>'id' = p_person_id
  limit 1;

  if person is null
     or person->>'status' <> 'processing'
     or coalesce(person->>'claimId', '') <> p_claim_id then
    return jsonb_build_object('ok', false, 'reason', 'claim_changed', 'split_bill', bill);
  end if;

  person := person || jsonb_build_object(
    'status', 'pending',
    'claimId', null,
    'claimedAt', null,
    'claimedBy', null
  );
  bill := jsonb_set(bill, array['people', person_index::text], person, false);
  update public.bar_tables set split_bill = bill where id = p_table_id;

  return jsonb_build_object('ok', true, 'split_bill', bill);
end;
$$;

revoke all on function public.claim_table_split_payment(uuid, text, text, text) from public;
grant execute on function public.claim_table_split_payment(uuid, text, text, text) to authenticated;
revoke all on function public.release_table_split_payment(uuid, text, text, text) from public;
grant execute on function public.release_table_split_payment(uuid, text, text, text) to authenticated;

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
  release_table boolean;
  split_bill_data jsonb;
  split_bill_id text;
  split_person_id text;
  split_claim_id text;
  current_split_bill jsonb;
  current_split_person jsonb;
  submitted_split_person jsonb;
  split_person_index integer;
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
  release_table := coalesce((payload->>'releaseTable')::boolean, true);
  split_bill_data := payload->'splitBill';
  split_bill_id := coalesce(payload->>'splitBillId', '');
  split_person_id := coalesce(payload->>'splitPersonId', '');
  split_claim_id := coalesce(payload->>'splitClaimId', '');
  if fiado_amount > 0 and (client_uuid is null or not exists (select 1 from public.clients where id = client_uuid)) then
    raise exception 'Cliente da venda fiado nao foi encontrado.';
  end if;

  if table_uuid is not null and split_person_id <> '' then
    select split_bill into current_split_bill
    from public.bar_tables
    where id = table_uuid
    for update;

    if current_split_bill is null or coalesce(current_split_bill->>'id', '') <> split_bill_id then
      raise exception 'A divisao desta mesa foi alterada. Atualize o aplicativo.';
    end if;

    select value, ordinality::integer - 1
    into current_split_person, split_person_index
    from jsonb_array_elements(coalesce(current_split_bill->'people', '[]'::jsonb)) with ordinality
    where value->>'id' = split_person_id
    limit 1;

    if current_split_person is null then
      raise exception 'Parte da conta nao encontrada.';
    end if;
    if current_split_person->>'status' = 'paid' then
      raise exception 'Esta parte da conta ja foi paga.';
    end if;
    if current_split_person->>'status' = 'processing'
       and coalesce(current_split_person->>'claimId', '') <> split_claim_id then
      raise exception 'Esta parte esta reservada em outro atendimento.';
    end if;

    select value into submitted_split_person
    from jsonb_array_elements(coalesce(split_bill_data->'people', '[]'::jsonb))
    where value->>'id' = split_person_id
    limit 1;
    if submitted_split_person is null
       or submitted_split_person->>'status' <> 'paid'
       or coalesce(submitted_split_person->>'saleId', '') <> sale_uuid::text then
      raise exception 'Confirmacao da parte dividida invalida.';
    end if;

    current_split_bill := jsonb_set(
      current_split_bill,
      array['people', split_person_index::text],
      submitted_split_person,
      false
    );
    current_split_bill := jsonb_set(current_split_bill, '{updatedAt}', to_jsonb(coalesce(payload->>'date', now()::text)), true);
    split_bill_data := current_split_bill;
    select bool_and(value->>'status' = 'paid') into release_table
    from jsonb_array_elements(current_split_bill->'people');
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
    if release_table then
      update public.bar_tables
      set status = 'Livre',
          opened_at = null,
          server_id = null,
          client_id = null,
          customer_name = '',
          items = '[]'::jsonb,
          split_bill = null
      where id = table_uuid;
    else
      update public.bar_tables
      set status = 'Fechamento',
          server_id = cashier_uuid,
          split_bill = split_bill_data
      where id = table_uuid;
    end if;
  end if;

  return jsonb_build_object('ok', true, 'already_synced', false, 'sale_id', sale_uuid);
end;
$$;

revoke all on function public.sync_offline_sale(jsonb) from public;
grant execute on function public.sync_offline_sale(jsonb) to authenticated;

notify pgrst, 'reload schema';
