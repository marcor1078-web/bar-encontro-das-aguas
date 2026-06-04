-- Complemento para permitir login visual por nome de usuario.
-- O Supabase Auth continua usando e-mail/senha por tras, mas o app consulta
-- esta coluna para descobrir o e-mail vinculado ao nome digitado.

alter table profiles
  add column if not exists email text,
  add column if not exists show_on_login boolean not null default false;

create unique index if not exists profiles_name_unique_idx
  on profiles (lower(name));

create unique index if not exists profiles_email_unique_idx
  on profiles (lower(email))
  where email is not null;

-- Depois de criar seu usuario em Authentication > Users, rode um UPDATE assim:
-- update profiles
-- set email = 'SEU_EMAIL_DO_AUTH',
--     show_on_login = false
-- where name = 'Marcos Admin';

create or replace function public.lookup_profile_for_login(username_input text)
returns table (
  id uuid,
  name text,
  email text,
  role text,
  permissions text[],
  active boolean,
  show_on_login boolean
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.name,
    p.email,
    p.role,
    p.permissions,
    p.active,
    p.show_on_login
  from public.profiles p
  where lower(p.name) = lower(trim(username_input))
    and p.active = true
  limit 1;
$$;

grant execute on function public.lookup_profile_for_login(text) to anon, authenticated;

alter table app_settings enable row level security;

drop policy if exists "app_settings_select_public" on app_settings;
create policy "app_settings_select_public"
on app_settings
for select
to anon, authenticated
using (true);
