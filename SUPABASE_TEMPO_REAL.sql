-- Execute uma vez no SQL Editor do Supabase.
-- Ativa eventos de alteracao usados para sincronizar os computadores da loja.

do $$
declare
  relation_name text;
  realtime_tables text[] := array[
    'bar_tables',
    'kitchen_orders',
    'products',
    'ingredients',
    'product_recipes',
    'product_lots',
    'inventory_counts',
    'clients',
    'client_transactions',
    'sales',
    'sale_items',
    'cancellations',
    'cash_sessions',
    'cash_movements',
    'suppliers',
    'purchases',
    'expenses',
    'app_settings',
    'profiles'
  ];
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    raise exception 'A publicacao supabase_realtime nao foi encontrada neste projeto.';
  end if;

  foreach relation_name in array realtime_tables
  loop
    if to_regclass('public.' || relation_name) is not null
       and not exists (
         select 1
         from pg_publication_tables
         where pubname = 'supabase_realtime'
           and schemaname = 'public'
           and tablename = relation_name
       ) then
      execute format('alter publication supabase_realtime add table public.%I', relation_name);
    end if;
  end loop;
end;
$$;

select schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
  and schemaname = 'public'
order by tablename;
