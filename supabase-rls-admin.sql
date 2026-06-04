-- Politicas RLS para administracao online: usuarios, configuracoes e backups.

alter table profiles
  add column if not exists email text,
  add column if not exists show_on_login boolean not null default false;

create unique index if not exists profiles_name_unique_idx
  on profiles (lower(name));

create unique index if not exists profiles_email_unique_idx
  on profiles (lower(email))
  where email is not null;

create table if not exists app_settings (
  id text primary key default 'main',
  bar_name text not null default 'BAR ENCONTRO DAS AGUAS',
  cnpj text,
  address text,
  service_fee numeric(5,2) not null default 10,
  receipt_footer text,
  auto_backup boolean not null default true,
  backup_interval_minutes integer not null default 30,
  last_auto_backup_at timestamptz,
  shift_start_view jsonb not null default '{}'::jsonb
);

create table if not exists backup_history (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  size integer not null,
  created_at timestamptz not null default now()
);

insert into app_settings (
  id,
  bar_name,
  service_fee,
  receipt_footer,
  auto_backup,
  backup_interval_minutes,
  shift_start_view
) values (
  'main',
  'BAR ENCONTRO DAS AGUAS',
  10,
  'Obrigado pela preferencia.',
  true,
  30,
  '{}'::jsonb
)
on conflict (id) do nothing;

alter table profiles enable row level security;
alter table app_settings enable row level security;
alter table backup_history enable row level security;

drop policy if exists "profiles_select_authenticated" on profiles;
create policy "profiles_select_authenticated"
on profiles
for select
to authenticated
using (true);

drop policy if exists "profiles_update_authenticated" on profiles;
create policy "profiles_update_authenticated"
on profiles
for update
to authenticated
using (true)
with check (true);

drop policy if exists "app_settings_select_public" on app_settings;
create policy "app_settings_select_public"
on app_settings
for select
to anon, authenticated
using (true);

drop policy if exists "app_settings_write_authenticated" on app_settings;
create policy "app_settings_write_authenticated"
on app_settings
for all
to authenticated
using (true)
with check (true);

drop policy if exists "backup_history_all_authenticated" on backup_history;
create policy "backup_history_all_authenticated"
on backup_history
for all
to authenticated
using (true)
with check (true);
