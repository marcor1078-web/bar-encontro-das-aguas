-- Base inicial para migrar o BAR ENCONTRO DAS AGUAS local para Supabase/PostgreSQL.
-- A autenticacao deve usar Supabase Auth. A tabela profiles complementa auth.users.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('admin', 'manager', 'cashier', 'stock')),
  permissions text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  station text not null default 'Bar',
  price numeric(12,2) not null,
  cost numeric(12,2) not null,
  stock numeric(12,3) not null default 0,
  min_stock numeric(12,3) not null default 0,
  critical_stock numeric(12,3) not null default 0,
  expires_at date,
  favorite boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null,
  stock numeric(12,3) not null default 0,
  min_stock numeric(12,3) not null default 0,
  cost_per_unit numeric(12,4) not null default 0
);

create table if not exists product_recipes (
  product_id uuid references products(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete restrict,
  qty numeric(12,3) not null,
  primary key (product_id, ingredient_id)
);

create table if not exists product_lots (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('product', 'ingredient')),
  item_id uuid not null,
  batch text not null,
  qty numeric(12,3) not null,
  expires_at date not null,
  supplier_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  debt numeric(12,2) not null default 0,
  credit_limit numeric(12,2) not null default 0,
  notes text
);

create table if not exists client_transactions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  sale_id uuid,
  user_id uuid references profiles(id),
  type text not null check (type in ('debito', 'pagamento')),
  description text not null,
  amount numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  cashier_id uuid references profiles(id),
  client_id uuid references clients(id),
  table_id uuid,
  payment text not null,
  status text not null default 'Concluida',
  service_fee numeric(12,2) not null default 0,
  cancelled_at timestamptz,
  cancelled_by uuid references profiles(id),
  cancel_reason text,
  total numeric(12,2) not null,
  cost numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references sales(id) on delete cascade,
  product_id uuid references products(id),
  name text not null,
  qty numeric(12,3) not null,
  price numeric(12,2) not null,
  cost numeric(12,2) not null
);

create table if not exists cash_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  opening_amount numeric(12,2) not null,
  closing_amount numeric(12,2),
  expected_amount numeric(12,2),
  difference numeric(12,2),
  closing_breakdown jsonb,
  notes text
);

create table if not exists cash_movements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  type text not null,
  amount numeric(12,2) not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists kitchen_orders (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references sales(id),
  station text not null,
  status text not null default 'Novo',
  items jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists bar_tables (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  customer_name text,
  status text not null default 'Livre',
  opened_at timestamptz,
  server_id uuid references profiles(id),
  client_id uuid references clients(id),
  items jsonb not null default '[]'::jsonb
);

create table if not exists cancellations (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references sales(id),
  user_id uuid references profiles(id),
  authorized_by uuid references profiles(id),
  reason text not null,
  total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

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

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  phone text
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references suppliers(id),
  item_name text not null,
  qty numeric(12,3) not null,
  unit_cost numeric(12,2) not null,
  total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text,
  amount numeric(12,2) not null,
  due_date date not null,
  paid boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists inventory_counts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  item_type text not null,
  item_id uuid not null,
  expected numeric(12,3) not null,
  counted numeric(12,3) not null,
  difference numeric(12,3) not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  action text not null,
  details text,
  created_at timestamptz not null default now()
);

create table if not exists backup_history (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'automatico',
  size integer not null default 0,
  created_at timestamptz not null default now()
);
