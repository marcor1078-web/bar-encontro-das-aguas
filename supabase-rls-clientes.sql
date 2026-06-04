-- Tabelas e politicas RLS para Clientes/Fiado online.

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  debt numeric(12,2) not null default 0,
  credit_limit numeric(12,2) not null default 0,
  notes text
);

create table if not exists client_transactions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  sale_id uuid,
  user_id uuid references profiles(id),
  type text not null check (type in ('debito', 'pagamento')),
  description text not null,
  amount numeric(12,2) not null,
  created_at timestamptz not null default now()
);

alter table clients enable row level security;
alter table client_transactions enable row level security;

drop policy if exists "clients_all_authenticated" on clients;
create policy "clients_all_authenticated"
on clients
for all
to authenticated
using (true)
with check (true);

drop policy if exists "client_transactions_all_authenticated" on client_transactions;
create policy "client_transactions_all_authenticated"
on client_transactions
for all
to authenticated
using (true)
with check (true);
