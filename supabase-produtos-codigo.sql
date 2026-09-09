-- Complemento para permitir codigo opcional nos produtos.
-- Rode no SQL Editor do Supabase antes de usar o codigo online.

alter table public.products
add column if not exists product_code text;

create unique index if not exists products_product_code_unique_idx
on public.products (lower(product_code))
where product_code is not null and trim(product_code) <> '';
