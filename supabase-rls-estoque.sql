-- Politicas RLS para permitir que usuarios autenticados operem estoque.
-- A chave publica continua sem permissao de escrita anonima.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  station text not null default 'Bar',
  price numeric(12,2) not null,
  cost numeric(12,2) not null,
  stock numeric(12,3) not null default 0,
  min_stock numeric(12,3) not null default 0,
  critical_stock numeric(12,3) not null default 0,
  favorite boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null,
  stock numeric(12,3) not null default 0,
  min_stock numeric(12,3) not null default 0,
  cost_per_unit numeric(12,4) not null default 0
);

create table if not exists product_recipes (
  product_id uuid references products(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete restrict,
  qty numeric(12,3) not null,
  primary key (product_id, ingredient_id)
);

create table if not exists product_lots (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('product', 'ingredient')),
  item_id uuid not null,
  batch text not null,
  qty numeric(12,3) not null,
  expires_at date not null,
  supplier_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists inventory_counts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  item_type text not null,
  item_id uuid not null,
  expected numeric(12,3) not null,
  counted numeric(12,3) not null,
  difference numeric(12,3) not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table products enable row level security;
alter table ingredients enable row level security;
alter table product_recipes enable row level security;
alter table product_lots enable row level security;
alter table inventory_counts enable row level security;

drop policy if exists "products_select_authenticated" on products;
create policy "products_select_authenticated"
on products
for select
to authenticated
using (true);

drop policy if exists "products_insert_authenticated" on products;
create policy "products_insert_authenticated"
on products
for insert
to authenticated
with check (true);

drop policy if exists "products_update_authenticated" on products;
create policy "products_update_authenticated"
on products
for update
to authenticated
using (true)
with check (true);

drop policy if exists "products_delete_authenticated" on products;
create policy "products_delete_authenticated"
on products
for delete
to authenticated
using (true);

drop policy if exists "ingredients_select_authenticated" on ingredients;
create policy "ingredients_select_authenticated"
on ingredients
for select
to authenticated
using (true);

drop policy if exists "ingredients_insert_authenticated" on ingredients;
create policy "ingredients_insert_authenticated"
on ingredients
for insert
to authenticated
with check (true);

drop policy if exists "ingredients_update_authenticated" on ingredients;
create policy "ingredients_update_authenticated"
on ingredients
for update
to authenticated
using (true)
with check (true);

drop policy if exists "ingredients_delete_authenticated" on ingredients;
create policy "ingredients_delete_authenticated"
on ingredients
for delete
to authenticated
using (true);

drop policy if exists "product_recipes_all_authenticated" on product_recipes;
create policy "product_recipes_all_authenticated"
on product_recipes
for all
to authenticated
using (true)
with check (true);

drop policy if exists "product_lots_all_authenticated" on product_lots;
create policy "product_lots_all_authenticated"
on product_lots
for all
to authenticated
using (true)
with check (true);

drop policy if exists "inventory_counts_all_authenticated" on inventory_counts;
create policy "inventory_counts_all_authenticated"
on inventory_counts
for all
to authenticated
using (true)
with check (true);
