-- Execute este arquivo uma vez no SQL Editor do Supabase.
-- Cria os insumos ausentes e configura um unico produto Copao com escolhas de
-- tamanho, bebida, energetico e gelo. Os demais produtos nao sao alterados.
--
-- Cada energetico baixa 350 ml no Copao de 500 ml e 450 ml no de 700 ml.

alter table public.products
add column if not exists sale_mixers jsonb not null default '[]'::jsonb;

insert into public.ingredients (name, unit, stock, min_stock, cost_per_unit)
select desired.name, desired.unit, 0, 0, 0
from (
  values
    ('Canudo', 'un'),
    ('Copo 500 ml', 'un'),
    ('Copo 700 ml', 'un'),
    ('Whisky Ballantines', 'ml'),
    ('Whisky Red Label', 'ml'),
    ('Whisky Passport', 'ml'),
    ('Whisky Black Fire', 'ml'),
    ('Whisky Cavalo Branco', 'ml'),
    ('Whisky Buchanans', 'ml'),
    ('Whisky Chivas', 'ml'),
    ('Whisky Jack Daniels', 'ml'),
    ('Gin', 'ml'),
    ('Busca Brisa', 'ml'),
    ('Energetico Start', 'ml'),
    ('Energetico Bad Wolf', 'ml'),
    ('Energetico Baly Tadala', 'ml'),
    ('Energetico Baly Tropical', 'ml'),
    ('Gelo saborizado Coco', 'un'),
    ('Gelo saborizado Maracuja', 'un'),
    ('Gelo saborizado Maca Verde', 'un'),
    ('Gelo saborizado Morango', 'un'),
    ('Gelo saborizado Melancia', 'un')
) as desired(name, unit)
where not exists (
  select 1
  from public.ingredients existing
  where lower(trim(existing.name)) = lower(trim(desired.name))
);

do $$
declare
  copao_id uuid;
  canudo_id uuid;
  bebidas jsonb;
  tamanhos jsonb;
  combinacoes jsonb;
  energeticos jsonb;
  gelos jsonb;
begin
  select id into copao_id
  from public.products
  where lower(trim(name)) in ('copao', 'copão')
  order by active desc, created_at asc
  limit 1;

  if copao_id is null then
    insert into public.products (
      name, category, station, price, cost, stock, min_stock, critical_stock, favorite, active
    ) values (
      'Copão', 'Copões', 'Bar', 10, 0, 0, 0, 0, false, true
    )
    returning id into copao_id;
  end if;

  select jsonb_agg(
    jsonb_build_object(
      'id', drink.brand_id,
      'label', drink.label,
      'price', 0,
      'recipe', '[]'::jsonb
    )
    order by drink.sort_order
  ) into bebidas
  from (
    values
      (1, 'brand-ballantines', 'Ballantines'),
      (2, 'brand-red-label', 'Red Label'),
      (3, 'brand-passport', 'Passport'),
      (4, 'brand-black-fire', 'Black Fire'),
      (5, 'brand-cavalo-branco', 'Cavalo Branco'),
      (6, 'brand-buchanans', 'Buchanans'),
      (7, 'brand-chivas', 'Chivas'),
      (8, 'brand-jack-daniels', 'Jack Daniels'),
      (9, 'brand-gin', 'Gin'),
      (10, 'brand-busca-brisa', 'Busca Brisa')
  ) as drink(sort_order, brand_id, label);

  tamanhos := jsonb_build_array(
    jsonb_build_object('id', 'variant-500-ml', 'label', '500 ml', 'price', 0, 'recipe', '[]'::jsonb),
    jsonb_build_object('id', 'variant-700-ml', 'label', '700 ml', 'price', 0, 'recipe', '[]'::jsonb)
  );

  select jsonb_agg(
    jsonb_build_object(
      'id', 'combination-' || drink.brand_id || '-' || size.variant_id,
      'brandId', drink.brand_id,
      'variantId', size.variant_id,
      'price', case when size.variant_id = 'variant-500-ml' then drink.price_500 else drink.price_700 end,
      'recipe', jsonb_build_array(
        jsonb_build_object('ingredientId', beverage_stock.id::text, 'qty', size.drink_ml),
        jsonb_build_object('ingredientId', cup_stock.id::text, 'qty', 1)
      )
    )
    order by drink.sort_order, size.sort_order
  ) into combinacoes
  from (
    values
      (1, 'brand-ballantines', 'Whisky Ballantines', 15::numeric, 20::numeric),
      (2, 'brand-red-label', 'Whisky Red Label', 15::numeric, 20::numeric),
      (3, 'brand-passport', 'Whisky Passport', 15::numeric, 20::numeric),
      (4, 'brand-black-fire', 'Whisky Black Fire', 10::numeric, 15::numeric),
      (5, 'brand-cavalo-branco', 'Whisky Cavalo Branco', 15::numeric, 20::numeric),
      (6, 'brand-buchanans', 'Whisky Buchanans', 30::numeric, 35::numeric),
      (7, 'brand-chivas', 'Whisky Chivas', 30::numeric, 35::numeric),
      (8, 'brand-jack-daniels', 'Whisky Jack Daniels', 30::numeric, 35::numeric),
      (9, 'brand-gin', 'Gin', 15::numeric, 20::numeric),
      (10, 'brand-busca-brisa', 'Busca Brisa', 15::numeric, 20::numeric)
  ) as drink(sort_order, brand_id, ingredient_name, price_500, price_700)
  cross join (
    values
      (1, 'variant-500-ml', 'Copo 500 ml', 100::numeric),
      (2, 'variant-700-ml', 'Copo 700 ml', 150::numeric)
  ) as size(sort_order, variant_id, cup_name, drink_ml)
  join public.ingredients beverage_stock
    on lower(trim(beverage_stock.name)) = lower(trim(drink.ingredient_name))
  join public.ingredients cup_stock
    on lower(trim(cup_stock.name)) = lower(trim(size.cup_name));

  select jsonb_agg(
    jsonb_build_object(
      'id', energy.mixer_id,
      'label', energy.label,
      'price', 0,
      'recipe', '[]'::jsonb,
      'recipeByVariant', jsonb_build_object(
        'variant-500-ml', jsonb_build_array(
          jsonb_build_object('ingredientId', energy_stock.id::text, 'qty', 350)
        ),
        'variant-700-ml', jsonb_build_array(
          jsonb_build_object('ingredientId', energy_stock.id::text, 'qty', 450)
        )
      )
    )
    order by energy.sort_order
  ) into energeticos
  from (
    values
      (1, 'mixer-start', 'Start', 'Energetico Start'),
      (2, 'mixer-bad-wolf', 'Bad Wolf', 'Energetico Bad Wolf'),
      (3, 'mixer-baly-tadala', 'Baly Tadala', 'Energetico Baly Tadala'),
      (4, 'mixer-baly-tropical', 'Baly Tropical', 'Energetico Baly Tropical')
  ) as energy(sort_order, mixer_id, label, ingredient_name)
  join public.ingredients energy_stock
    on lower(trim(energy_stock.name)) = lower(trim(energy.ingredient_name));

  select jsonb_agg(
    jsonb_build_object(
      'id', ice.flavor_id,
      'label', ice.label,
      'price', 0,
      'recipe', jsonb_build_array(
        jsonb_build_object('ingredientId', ice_stock.id::text, 'qty', 1)
      )
    )
    order by ice.sort_order
  ) into gelos
  from (
    values
      (1, 'flavor-coco', 'Coco', 'Gelo saborizado Coco'),
      (2, 'flavor-maracuja', 'Maracujá', 'Gelo saborizado Maracuja'),
      (3, 'flavor-maca-verde', 'Maçã Verde', 'Gelo saborizado Maca Verde'),
      (4, 'flavor-morango', 'Morango', 'Gelo saborizado Morango'),
      (5, 'flavor-melancia', 'Melancia', 'Gelo saborizado Melancia')
  ) as ice(sort_order, flavor_id, label, ingredient_name)
  join public.ingredients ice_stock
    on lower(trim(ice_stock.name)) = lower(trim(ice.ingredient_name));

  update public.products
  set name = 'Copão',
      category = 'Copões',
      station = 'Bar',
      price = 10,
      cost = 0,
      stock = 0,
      units_per_package = 0,
      package_name = null,
      package_cost = 0,
      package_sale_price = 0,
      sale_brands = coalesce(bebidas, '[]'::jsonb),
      sale_variants = coalesce(tamanhos, '[]'::jsonb),
      sale_combinations = coalesce(combinacoes, '[]'::jsonb),
      sale_mixers = coalesce(energeticos, '[]'::jsonb),
      sale_flavors = coalesce(gelos, '[]'::jsonb),
      active = true
  where id = copao_id;

  select id into canudo_id
  from public.ingredients
  where lower(trim(name)) = lower('Canudo')
  order by id
  limit 1;

  delete from public.product_recipes where product_id = copao_id;
  insert into public.product_recipes (product_id, ingredient_id, qty)
  values (copao_id, canudo_id, 1)
  on conflict (product_id, ingredient_id) do update set qty = excluded.qty;
end;
$$;

notify pgrst, 'reload schema';

