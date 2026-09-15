alter table suppliers
  add column if not exists phone_2 text,
  add column if not exists phone_3 text,
  add column if not exists phone_4 text,
  add column if not exists phone_5 text,
  add column if not exists email text,
  add column if not exists cnpj text,
  add column if not exists address text;

update suppliers
set email = contact
where coalesce(email, '') = ''
  and contact like '%@%';
