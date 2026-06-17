-- Adiciona validade opcional aos produtos.
-- Rode este SQL uma unica vez no Supabase SQL Editor.

alter table public.products
add column if not exists expires_at date;
