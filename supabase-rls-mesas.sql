-- Tabela e politicas RLS para Mesas e comandas online.

create table if not exists bar_tables (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  customer_name text,
  status text not null default 'Livre',
  opened_at timestamptz,
  server_id uuid references profiles(id),
  client_id uuid references clients(id),
  items jsonb not null default '[]'::jsonb
);

alter table bar_tables
  add column if not exists customer_name text;

alter table bar_tables enable row level security;

drop policy if exists "bar_tables_all_authenticated" on bar_tables;
create policy "bar_tables_all_authenticated"
on bar_tables
for all
to authenticated
using (true)
with check (true);
