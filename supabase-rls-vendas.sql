-- Tabelas e politicas RLS para Vendas, Itens e Cozinha online.

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  cashier_id uuid references profiles(id),
  client_id uuid references clients(id),
  table_id uuid,
  payment text not null,
  status text not null default 'Concluida',
  service_fee numeric(12,2) not null default 0,
  cancelled_at timestamptz,
  cancelled_by uuid references profiles(id),
  cancel_reason text,
  total numeric(12,2) not null,
  cost numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references sales(id) on delete cascade,
  product_id uuid references products(id),
  name text not null,
  qty numeric(12,3) not null,
  price numeric(12,2) not null,
  cost numeric(12,2) not null
);

create table if not exists kitchen_orders (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references sales(id),
  station text not null,
  status text not null default 'Novo',
  items jsonb not null,
  user_id uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists cancellations (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references sales(id),
  user_id uuid references profiles(id),
  authorized_by uuid references profiles(id),
  reason text not null,
  total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

alter table sales enable row level security;
alter table sale_items enable row level security;
alter table kitchen_orders enable row level security;
alter table cancellations enable row level security;

drop policy if exists "sales_all_authenticated" on sales;
create policy "sales_all_authenticated"
on sales
for all
to authenticated
using (true)
with check (true);

drop policy if exists "sale_items_all_authenticated" on sale_items;
create policy "sale_items_all_authenticated"
on sale_items
for all
to authenticated
using (true)
with check (true);

drop policy if exists "kitchen_orders_all_authenticated" on kitchen_orders;
create policy "kitchen_orders_all_authenticated"
on kitchen_orders
for all
to authenticated
using (true)
with check (true);

drop policy if exists "cancellations_all_authenticated" on cancellations;
create policy "cancellations_all_authenticated"
on cancellations
for all
to authenticated
using (true)
with check (true);
