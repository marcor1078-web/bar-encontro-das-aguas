-- Cancela uma venda online, devolve produtos/insumos e registra o historico
-- em uma unica transacao. Execute uma vez no SQL Editor do Supabase.

create or replace function public.cancel_sale_restore_inventory(
  p_sale_id uuid,
  p_reason text,
  p_authorized_by uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
declare
  v_actor uuid := auth.uid();
  v_sale public.sales%rowtype;
  v_sale_item record;
  v_recipe_item jsonb;
  v_recipe_row record;
  v_ingredient_id uuid;
  v_required numeric(12,3);
  v_stock_units numeric(12,3);
  v_old_stock numeric(12,3);
  v_new_stock numeric(12,3);
  v_payment_details jsonb;
  v_fiado_amount numeric(12,2) := 0;
  v_transaction_debt numeric(12,2) := 0;
  v_restored_ingredients integer := 0;
  v_restored_products integer := 0;
begin
  if v_actor is null then
    raise exception 'Sessao expirada. Entre novamente no app.';
  end if;

  if coalesce(trim(p_reason), '') = '' then
    raise exception 'Informe o motivo do cancelamento.';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = v_actor and active = true
  ) then
    raise exception 'Usuario inativo ou sem perfil.';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = p_authorized_by and role = 'admin' and active = true
  ) then
    raise exception 'A autorizacao de administrador nao foi validada.';
  end if;

  select * into v_sale
  from public.sales
  where id = p_sale_id
  for update;

  if not found then
    raise exception 'Venda nao encontrada.';
  end if;

  if v_sale.status in ('Cancelada', 'Zerada') then
    raise exception 'Venda ja cancelada ou zerada.';
  end if;

  for v_sale_item in
    select * from public.sale_items where sale_id = p_sale_id order by id
  loop
    if v_sale_item.product_id is null then
      continue;
    end if;

    v_stock_units := greatest(
      1,
      coalesce((v_sale_item.selection->>'stockUnitsPerItem')::numeric, 1)
    ) * greatest(0, coalesce(v_sale_item.qty, 0));

    if jsonb_typeof(v_sale_item.stock_recipe) = 'array'
       and jsonb_array_length(v_sale_item.stock_recipe) > 0 then
      for v_recipe_item in
        select value from jsonb_array_elements(v_sale_item.stock_recipe)
      loop
        v_ingredient_id := nullif(v_recipe_item->>'ingredientId', '')::uuid;
        v_required := greatest(0, coalesce((v_recipe_item->>'qty')::numeric, 0)) * v_stock_units;
        if v_ingredient_id is null or v_required <= 0 then
          continue;
        end if;

        select stock into v_old_stock
        from public.ingredients where id = v_ingredient_id for update;
        if not found then
          raise exception 'Insumo da venda nao encontrado (%).', v_ingredient_id;
        end if;

        update public.ingredients
        set stock = stock + v_required
        where id = v_ingredient_id
        returning stock into v_new_stock;

        insert into public.inventory_counts
          (user_id, item_type, item_id, expected, counted, difference, notes)
        values
          (v_actor, 'ingredient', v_ingredient_id, v_old_stock, v_new_stock,
           v_required, 'Devolucao de estoque por cancelamento da venda ' || p_sale_id::text);
        v_restored_ingredients := v_restored_ingredients + 1;
      end loop;
    elsif exists (
      select 1 from public.product_recipes where product_id = v_sale_item.product_id
    ) then
      for v_recipe_row in
        select ingredient_id, qty
        from public.product_recipes
        where product_id = v_sale_item.product_id
        order by ingredient_id
      loop
        v_required := greatest(0, coalesce(v_recipe_row.qty, 0)) * v_stock_units;
        if v_required <= 0 then
          continue;
        end if;

        select stock into v_old_stock
        from public.ingredients where id = v_recipe_row.ingredient_id for update;
        if not found then
          raise exception 'Insumo da ficha tecnica nao encontrado (%).', v_recipe_row.ingredient_id;
        end if;

        update public.ingredients
        set stock = stock + v_required
        where id = v_recipe_row.ingredient_id
        returning stock into v_new_stock;

        insert into public.inventory_counts
          (user_id, item_type, item_id, expected, counted, difference, notes)
        values
          (v_actor, 'ingredient', v_recipe_row.ingredient_id, v_old_stock, v_new_stock,
           v_required, 'Devolucao de estoque por cancelamento da venda ' || p_sale_id::text);
        v_restored_ingredients := v_restored_ingredients + 1;
      end loop;
    else
      select stock into v_old_stock
      from public.products where id = v_sale_item.product_id for update;
      if not found then
        raise exception 'Produto da venda nao encontrado (%).', v_sale_item.product_id;
      end if;

      update public.products
      set stock = stock + v_stock_units
      where id = v_sale_item.product_id
      returning stock into v_new_stock;

      insert into public.inventory_counts
        (user_id, item_type, item_id, expected, counted, difference, notes)
      values
        (v_actor, 'product', v_sale_item.product_id, v_old_stock, v_new_stock,
         v_stock_units, 'Devolucao de estoque por cancelamento da venda ' || p_sale_id::text);
      v_restored_products := v_restored_products + 1;
    end if;
  end loop;

  if v_sale.client_id is not null then
    perform 1 from public.client_transactions
    where sale_id = p_sale_id and type = 'debito'
    for update;

    select coalesce(sum(amount), 0) into v_transaction_debt
    from public.client_transactions
    where sale_id = p_sale_id and type = 'debito';

    if v_transaction_debt > 0 then
      v_fiado_amount := v_transaction_debt;
    elsif left(coalesce(v_sale.payment, ''), 16) = 'PAYMENT_DETAILS:' then
      begin
        v_payment_details := substring(v_sale.payment from 17)::jsonb;
        select coalesce(sum((part->>'amount')::numeric), 0) into v_fiado_amount
        from jsonb_array_elements(coalesce(v_payment_details->'breakdown', '[]'::jsonb)) part
        where part->>'method' = 'Fiado';
      exception when others then
        v_fiado_amount := 0;
      end;
    elsif lower(trim(coalesce(v_sale.payment, ''))) = 'fiado' then
      v_fiado_amount := v_sale.total;
    end if;

    if v_fiado_amount > 0 then
      update public.clients
      set debt = greatest(0, debt - v_fiado_amount)
      where id = v_sale.client_id;
      delete from public.client_transactions
      where sale_id = p_sale_id and type = 'debito';
    end if;
  end if;

  update public.sales
  set status = 'Cancelada',
      cancelled_at = now(),
      cancelled_by = v_actor,
      cancel_reason = trim(p_reason)
  where id = p_sale_id;

  insert into public.cancellations
    (sale_id, user_id, authorized_by, reason, total)
  values
    (p_sale_id, v_actor, p_authorized_by, trim(p_reason), v_sale.total);

  return jsonb_build_object(
    'sale_id', p_sale_id,
    'status', 'Cancelada',
    'restored_ingredients', v_restored_ingredients,
    'restored_products', v_restored_products
  );
end;
$function$;

revoke all on function public.cancel_sale_restore_inventory(uuid, text, uuid) from public;
revoke all on function public.cancel_sale_restore_inventory(uuid, text, uuid) from anon;
grant execute on function public.cancel_sale_restore_inventory(uuid, text, uuid) to authenticated;
