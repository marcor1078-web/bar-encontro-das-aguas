-- Complemento para permitir codigo opcional nos produtos.
-- Rode no SQL Editor do Supabase antes de usar o codigo online.

alter table public.products
add column if not exists product_code text;

alter table public.products
add column if not exists barcode_codes text[] not null default '{}';

create unique index if not exists products_product_code_unique_idx
on public.products (lower(product_code))
where product_code is not null and trim(product_code) <> '';

create index if not exists products_barcode_codes_idx
on public.products using gin (barcode_codes);
