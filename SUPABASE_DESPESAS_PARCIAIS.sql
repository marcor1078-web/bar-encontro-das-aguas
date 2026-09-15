alter table expenses
  add column if not exists paid_amount numeric(12,2) not null default 0,
  add column if not exists payment_history jsonb not null default '[]'::jsonb;

update expenses
set paid_amount = amount
where paid = true
  and paid_amount = 0;

update expenses
set paid_amount = least(greatest(coalesce(paid_amount, 0), 0), amount),
    payment_history = coalesce(payment_history, '[]'::jsonb);

update expenses
set paid = paid_amount >= amount,
    paid_at = case
      when paid_amount >= amount and paid_at is null then now()
      when paid_amount < amount then null
      else paid_at
    end;
