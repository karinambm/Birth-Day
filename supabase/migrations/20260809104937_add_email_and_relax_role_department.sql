alter table public.birthdays
  add column email text,
  add column birth_year smallint,
  alter column role drop not null,
  alter column department drop not null;

alter table public.birthdays
  add constraint birthdays_email_key unique (email);
