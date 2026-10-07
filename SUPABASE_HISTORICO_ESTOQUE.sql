-- Corrige as permissoes do historico de entradas, retiradas e contagens do estoque.
-- Pode ser executado mais de uma vez sem apagar os registros existentes.

create table if not exists public.inventory_counts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  item_type text not null,
  item_id uuid not null,
  expected numeric(12,3) not null,
  counted numeric(12,3) not null,
  difference numeric(12,3) not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.inventory_counts enable row level security;
alter table public.inventory_counts alter column user_id set default auth.uid();

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.inventory_counts to authenticated;
revoke insert, update, delete on table public.inventory_counts from anon;

drop policy if exists "inventory_counts_all_authenticated" on public.inventory_counts;
drop policy if exists "inventory_counts_select_authenticated" on public.inventory_counts;
drop policy if exists "inventory_counts_insert_authenticated" on public.inventory_counts;
drop policy if exists "inventory_counts_update_authenticated" on public.inventory_counts;
drop policy if exists "inventory_counts_delete_authenticated" on public.inventory_counts;

create policy "inventory_counts_select_authenticated"
on public.inventory_counts
for select
to authenticated
using (true);

create policy "inventory_counts_insert_authenticated"
on public.inventory_counts
for insert
to authenticated
with check (user_id = auth.uid());

create policy "inventory_counts_update_authenticated"
on public.inventory_counts
for update
to authenticated
using (true)
with check (true);

create policy "inventory_counts_delete_authenticated"
on public.inventory_counts
for delete
to authenticated
using (true);

select policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename = 'inventory_counts'
order by policyname;
