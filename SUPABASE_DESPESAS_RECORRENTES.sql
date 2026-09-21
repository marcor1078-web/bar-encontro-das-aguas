-- Execute no SQL Editor do Supabase antes de usar despesas recorrentes online.
-- Cada quitacao gera uma nova despesa mensal, preservando o historico anterior.

alter table public.expenses
  add column if not exists recurring boolean not null default false,
  add column if not exists recurring_day integer,
  add column if not exists recurring_from uuid;

create unique index if not exists expenses_recurring_from_unique
  on public.expenses (recurring_from);

create or replace function public.renew_paid_expense()
returns trigger
language plpgsql
as $$
declare
  next_month date;
  next_due date;
begin
  if not new.recurring or not new.paid or new.recurring_day not between 1 and 31 then
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if old.paid and old.recurring then
      return new;
    end if;
  end if;

  next_month := (date_trunc('month', new.due_date)::date + interval '1 month')::date;
  next_due := next_month + (
    least(new.recurring_day, extract(day from (next_month + interval '1 month - 1 day'))::integer) - 1
  );

  insert into public.expenses
    (description, category, amount, expense_date, due_date, paid, paid_amount,
     payment_history, recurring, recurring_day, recurring_from)
  values
    (new.description, new.category, new.amount, next_due, next_due, false, 0,
     '[]'::jsonb, true, new.recurring_day, new.id)
  on conflict (recurring_from) do nothing;

  return new;
end;
$$;

drop trigger if exists expenses_renew_paid on public.expenses;
create trigger expenses_renew_paid
after insert or update on public.expenses
for each row execute function public.renew_paid_expense();
