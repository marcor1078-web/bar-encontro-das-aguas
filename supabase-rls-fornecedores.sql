-- Tabelas e politicas RLS para Fornecedores, compras e despesas online.

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  phone text
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references suppliers(id),
  item_name text not null,
  qty numeric(12,3) not null,
  unit_cost numeric(12,2) not null,
  total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text,
  amount numeric(12,2) not null,
  due_date date not null,
  paid boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table suppliers enable row level security;
alter table purchases enable row level security;
alter table expenses enable row level security;

drop policy if exists "suppliers_all_authenticated" on suppliers;
create policy "suppliers_all_authenticated"
on suppliers
for all
to authenticated
using (true)
with check (true);

drop policy if exists "purchases_all_authenticated" on purchases;
create policy "purchases_all_authenticated"
on purchases
for all
to authenticated
using (true)
with check (true);

drop policy if exists "expenses_all_authenticated" on expenses;
create policy "expenses_all_authenticated"
on expenses
for all
to authenticated
using (true)
with check (true);
