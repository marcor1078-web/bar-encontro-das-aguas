-- Execute este arquivo uma vez no SQL Editor do Supabase.
-- Permite configurar preco e ficha tecnica por marca + tamanho.

alter table public.products
add column if not exists sale_brands jsonb not null default '[]'::jsonb;

alter table public.products
add column if not exists sale_combinations jsonb not null default '[]'::jsonb;

notify pgrst, 'reload schema';
