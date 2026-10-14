-- Controle opcional de fardos, caixas e pacotes.
-- O saldo principal continua armazenado em unidades.

alter table public.products
add column if not exists package_name text;

alter table public.products
add column if not exists units_per_package numeric(12,3) not null default 0;

alter table public.products
add column if not exists package_cost numeric(12,2) not null default 0;

comment on column public.products.package_name is
'Nome da embalagem de compra, como Fardo, Caixa ou Pacote.';

comment on column public.products.units_per_package is
'Quantidade de unidades vendaveis contidas em cada embalagem.';

comment on column public.products.package_cost is
'Valor de compra da embalagem completa.';
