-- Tabelas e politicas RLS para Caixa online.

create table if not exists cash_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  opening_amount numeric(12,2) not null,
  closing_amount numeric(12,2),
  expected_amount numeric(12,2),
  difference numeric(12,2),
  closing_breakdown jsonb,
  notes text
);

create table if not exists cash_movements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  type text not null,
  amount numeric(12,2) not null,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table cash_sessions enable row level security;
alter table cash_movements enable row level security;

drop policy if exists "cash_sessions_all_authenticated" on cash_sessions;
create policy "cash_sessions_all_authenticated"
on cash_sessions
for all
to authenticated
using (true)
with check (true);

drop policy if exists "cash_movements_all_authenticated" on cash_movements;
create policy "cash_movements_all_authenticated"
on cash_movements
for all
to authenticated
using (true)
with check (true);
