-- Gestao avancada da DISTRIBUIDORA ENCONTRO DAS AGUAS.
-- Execute este arquivo inteiro uma vez no SQL Editor do Supabase.
-- Pode ser executado novamente sem apagar os dados existentes.

begin;

create or replace function public.is_current_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and active = true
  );
$$;

revoke all on function public.is_current_admin() from public;
grant execute on function public.is_current_admin() to authenticated;

alter table public.app_settings
  add column if not exists advanced_settings jsonb not null default '{}'::jsonb;

alter table public.backup_history
  add column if not exists snapshot jsonb,
  add column if not exists checksum text,
  add column if not exists created_by uuid references public.profiles(id),
  add column if not exists restorable boolean not null default false;

alter table public.kitchen_orders
  add column if not exists user_id uuid references public.profiles(id);

-- Mantem a migracao independente dos ajustes anteriores de despesas.
alter table public.expenses
  add column if not exists expense_date date,
  add column if not exists paid_amount numeric(12,2) not null default 0,
  add column if not exists payment_history jsonb not null default '[]'::jsonb,
  add column if not exists recurring boolean not null default false,
  add column if not exists recurring_day integer,
  add column if not exists recurring_from uuid references public.expenses(id) on delete set null;

update public.expenses
set expense_date = coalesce(expense_date, created_at::date, current_date)
where expense_date is null;

alter table public.expenses
  alter column expense_date set default current_date,
  alter column expense_date set not null;

create table if not exists public.payment_reconciliation_reviews (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null unique references public.sales(id) on delete cascade,
  status text not null check (status in ('confirmed', 'pending', 'discrepancy')),
  note text not null default '',
  reviewed_by uuid not null references public.profiles(id),
  reviewed_at timestamptz not null default now()
);

create table if not exists public.app_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  device_key text not null,
  label text not null default 'Aparelho',
  user_agent text,
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, device_key)
);

create index if not exists app_devices_last_seen_idx on public.app_devices(last_seen_at desc);
create index if not exists reconciliation_reviews_status_idx on public.payment_reconciliation_reviews(status, reviewed_at desc);

alter table public.payment_reconciliation_reviews enable row level security;
alter table public.app_devices enable row level security;
alter table public.audit_log enable row level security;
alter table public.backup_history enable row level security;

drop policy if exists "profiles_update_authenticated" on public.profiles;
drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles
for update
to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "app_settings_write_authenticated" on public.app_settings;
drop policy if exists "app_settings_admin_write" on public.app_settings;
create policy "app_settings_admin_write"
on public.app_settings
for all
to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "payment_reconciliation_select" on public.payment_reconciliation_reviews;
create policy "payment_reconciliation_select"
on public.payment_reconciliation_reviews
for select
to authenticated
using (true);

drop policy if exists "payment_reconciliation_admin_insert" on public.payment_reconciliation_reviews;
create policy "payment_reconciliation_admin_insert"
on public.payment_reconciliation_reviews
for insert
to authenticated
with check (public.is_current_admin() and reviewed_by = auth.uid());

drop policy if exists "payment_reconciliation_admin_update" on public.payment_reconciliation_reviews;
create policy "payment_reconciliation_admin_update"
on public.payment_reconciliation_reviews
for update
to authenticated
using (public.is_current_admin())
with check (public.is_current_admin() and reviewed_by = auth.uid());

drop policy if exists "app_devices_select" on public.app_devices;
create policy "app_devices_select"
on public.app_devices
for select
to authenticated
using (user_id = auth.uid() or public.is_current_admin());

drop policy if exists "audit_log_select_authenticated" on public.audit_log;
create policy "audit_log_select_authenticated"
on public.audit_log
for select
to authenticated
using (true);

drop policy if exists "audit_log_insert_own" on public.audit_log;
create policy "audit_log_insert_own"
on public.audit_log
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "backup_history_all_authenticated" on public.backup_history;
drop policy if exists "backup_history_select_authenticated" on public.backup_history;
create policy "backup_history_select_authenticated"
on public.backup_history
for select
to authenticated
using (true);

drop policy if exists "backup_history_insert_authenticated" on public.backup_history;
create policy "backup_history_insert_authenticated"
on public.backup_history
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "backup_history_admin_update" on public.backup_history;
create policy "backup_history_admin_update"
on public.backup_history
for update
to authenticated
using (public.is_current_admin())
with check (public.is_current_admin());

drop policy if exists "backup_history_admin_delete" on public.backup_history;
create policy "backup_history_admin_delete"
on public.backup_history
for delete
to authenticated
using (public.is_current_admin());

create or replace function public.protect_audit_log()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;
  raise exception 'O historico de auditoria e imutavel';
end;
$$;

drop trigger if exists audit_log_immutable on public.audit_log;
create trigger audit_log_immutable
before update or delete on public.audit_log
for each row execute function public.protect_audit_log();

create or replace function public.touch_app_device(
  p_device_key text,
  p_label text,
  p_user_agent text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  device_row public.app_devices%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Usuario nao autenticado';
  end if;

  select * into device_row
  from public.app_devices
  where user_id = auth.uid() and device_key = p_device_key
  for update;

  if found and device_row.revoked_at is not null then
    return jsonb_build_object('allowed', false, 'device_id', device_row.id);
  end if;

  if found then
    update public.app_devices
    set label = left(coalesce(nullif(p_label, ''), label), 120),
        user_agent = left(coalesce(p_user_agent, ''), 500),
        last_seen_at = now()
    where id = device_row.id
    returning * into device_row;
  else
    insert into public.app_devices (user_id, device_key, label, user_agent)
    values (auth.uid(), p_device_key, left(coalesce(nullif(p_label, ''), 'Aparelho'), 120), left(coalesce(p_user_agent, ''), 500))
    returning * into device_row;
  end if;

  return jsonb_build_object('allowed', true, 'device_id', device_row.id, 'last_seen_at', device_row.last_seen_at);
end;
$$;

revoke all on function public.touch_app_device(text, text, text) from public;
grant execute on function public.touch_app_device(text, text, text) to authenticated;

create or replace function public.set_app_device_revoked(
  p_device_id uuid,
  p_revoked boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_admin() then
    raise exception 'Somente administradores podem alterar aparelhos';
  end if;

  update public.app_devices
  set revoked_at = case when p_revoked then now() else null end
  where id = p_device_id;
end;
$$;

revoke all on function public.set_app_device_revoked(uuid, boolean) from public;
grant execute on function public.set_app_device_revoked(uuid, boolean) to authenticated;

create or replace function public.touch_app_backup_time(p_created_at timestamptz default now())
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Usuario nao autenticado';
  end if;
  update public.app_settings
  set last_auto_backup_at = coalesce(p_created_at, now())
  where id = 'main';
end;
$$;

revoke all on function public.touch_app_backup_time(timestamptz) from public;
grant execute on function public.touch_app_backup_time(timestamptz) to authenticated;

create or replace function public.compact_old_app_backups()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.backup_history
  set snapshot = null, restorable = false
  where id in (
    select id
    from public.backup_history
    where snapshot is not null
    order by created_at desc
    offset 20
  );
  return null;
end;
$$;

drop trigger if exists compact_app_backups_after_insert on public.backup_history;
create trigger compact_app_backups_after_insert
after insert on public.backup_history
for each statement execute function public.compact_old_app_backups();

create or replace function public.restore_app_backup(
  p_backup_id uuid,
  p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  backup_snapshot jsonb;
  tables_snapshot jsonb;
  restored_at timestamptz := now();
begin
  if not public.is_current_admin() then
    raise exception 'Somente administradores podem restaurar backups';
  end if;

  select snapshot into backup_snapshot
  from public.backup_history
  where id = p_backup_id and restorable = true
  for update;

  if backup_snapshot is null then
    raise exception 'Backup inexistente ou sem snapshot restauravel';
  end if;

  tables_snapshot := backup_snapshot -> 'tables';
  if tables_snapshot is null then
    raise exception 'Formato de backup invalido';
  end if;

  lock table public.sales, public.sale_items, public.products, public.ingredients,
    public.clients, public.cash_sessions, public.cash_movements, public.suppliers,
    public.expenses, public.bar_tables in share row exclusive mode;

  delete from public.client_transactions;
  delete from public.cancellations;
  delete from public.kitchen_orders;
  delete from public.sale_items;
  delete from public.sales;
  delete from public.cash_movements;
  delete from public.cash_sessions;
  delete from public.inventory_counts;
  delete from public.product_recipes;
  delete from public.product_lots;
  delete from public.purchases;
  delete from public.expenses;
  delete from public.bar_tables;
  delete from public.clients;
  delete from public.products;
  delete from public.ingredients;
  delete from public.suppliers;

  insert into public.suppliers select * from jsonb_populate_recordset(null::public.suppliers, coalesce(tables_snapshot -> 'suppliers', '[]'::jsonb));
  insert into public.ingredients select * from jsonb_populate_recordset(null::public.ingredients, coalesce(tables_snapshot -> 'ingredients', '[]'::jsonb));
  insert into public.products select * from jsonb_populate_recordset(null::public.products, coalesce(tables_snapshot -> 'products', '[]'::jsonb));
  insert into public.clients select * from jsonb_populate_recordset(null::public.clients, coalesce(tables_snapshot -> 'clients', '[]'::jsonb));
  insert into public.bar_tables select * from jsonb_populate_recordset(null::public.bar_tables, coalesce(tables_snapshot -> 'bar_tables', '[]'::jsonb));
  insert into public.product_recipes select * from jsonb_populate_recordset(null::public.product_recipes, coalesce(tables_snapshot -> 'product_recipes', '[]'::jsonb));
  insert into public.product_lots select * from jsonb_populate_recordset(null::public.product_lots, coalesce(tables_snapshot -> 'product_lots', '[]'::jsonb));
  insert into public.sales select * from jsonb_populate_recordset(null::public.sales, coalesce(tables_snapshot -> 'sales', '[]'::jsonb));
  insert into public.sale_items select * from jsonb_populate_recordset(null::public.sale_items, coalesce(tables_snapshot -> 'sale_items', '[]'::jsonb));
  insert into public.client_transactions select * from jsonb_populate_recordset(null::public.client_transactions, coalesce(tables_snapshot -> 'client_transactions', '[]'::jsonb));
  insert into public.cash_sessions select * from jsonb_populate_recordset(null::public.cash_sessions, coalesce(tables_snapshot -> 'cash_sessions', '[]'::jsonb));
  insert into public.cash_movements select * from jsonb_populate_recordset(null::public.cash_movements, coalesce(tables_snapshot -> 'cash_movements', '[]'::jsonb));
  insert into public.purchases select * from jsonb_populate_recordset(null::public.purchases, coalesce(tables_snapshot -> 'purchases', '[]'::jsonb));

  insert into public.expenses (
    id, description, category, amount, expense_date, due_date, paid, paid_at,
    created_at, paid_amount, payment_history, recurring, recurring_day, recurring_from
  )
  select id, description, category, amount, expense_date, due_date, false, paid_at,
    created_at, paid_amount, payment_history, false, recurring_day, recurring_from
  from jsonb_to_recordset(coalesce(tables_snapshot -> 'expenses', '[]'::jsonb)) as x(
    id uuid, description text, category text, amount numeric, expense_date date,
    due_date date, paid boolean, paid_at timestamptz, created_at timestamptz,
    paid_amount numeric, payment_history jsonb, recurring boolean,
    recurring_day integer, recurring_from uuid
  );

  update public.expenses e
  set paid = x.paid,
      recurring = x.recurring,
      paid_at = x.paid_at,
      paid_amount = x.paid_amount,
      payment_history = x.payment_history,
      recurring_day = x.recurring_day,
      recurring_from = x.recurring_from
  from jsonb_to_recordset(coalesce(tables_snapshot -> 'expenses', '[]'::jsonb)) as x(
    id uuid, paid boolean, recurring boolean, paid_at timestamptz,
    paid_amount numeric, payment_history jsonb, recurring_day integer, recurring_from uuid
  )
  where e.id = x.id;

  insert into public.inventory_counts select * from jsonb_populate_recordset(null::public.inventory_counts, coalesce(tables_snapshot -> 'inventory_counts', '[]'::jsonb));
  insert into public.kitchen_orders select * from jsonb_populate_recordset(null::public.kitchen_orders, coalesce(tables_snapshot -> 'kitchen_orders', '[]'::jsonb));
  insert into public.cancellations select * from jsonb_populate_recordset(null::public.cancellations, coalesce(tables_snapshot -> 'cancellations', '[]'::jsonb));

  update public.app_settings current_settings
  set bar_name = backup_settings.bar_name,
      cnpj = backup_settings.cnpj,
      address = backup_settings.address,
      service_fee = backup_settings.service_fee,
      receipt_footer = backup_settings.receipt_footer,
      auto_backup = backup_settings.auto_backup,
      backup_interval_minutes = backup_settings.backup_interval_minutes,
      shift_start_view = backup_settings.shift_start_view,
      advanced_settings = coalesce(backup_settings.advanced_settings, '{}'::jsonb)
  from jsonb_populate_recordset(null::public.app_settings, coalesce(tables_snapshot -> 'app_settings', '[]'::jsonb)) backup_settings
  where current_settings.id = backup_settings.id;

  insert into public.audit_log (user_id, action, details)
  values (auth.uid(), 'Backup restaurado', concat('Backup ', p_backup_id, '. ', left(coalesce(p_reason, ''), 1000)));

  return jsonb_build_object('ok', true, 'backup_id', p_backup_id, 'restored_at', restored_at);
end;
$$;

revoke all on function public.restore_app_backup(uuid, text) from public;
grant execute on function public.restore_app_backup(uuid, text) to authenticated;

commit;
