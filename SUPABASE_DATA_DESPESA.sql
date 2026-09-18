-- Execute todo este arquivo uma unica vez no SQL Editor do Supabase.
-- Registros antigos recebem a data em que foram cadastrados.

alter table public.expenses
  add column if not exists expense_date date;

update public.expenses
set expense_date = created_at::date
where expense_date is null;

alter table public.expenses
  alter column expense_date set default current_date,
  alter column expense_date set not null;
