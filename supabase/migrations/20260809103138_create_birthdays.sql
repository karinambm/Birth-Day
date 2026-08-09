create table public.birthdays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  department text not null,
  birth_month smallint not null check (birth_month between 1 and 12),
  birth_day smallint not null check (birth_day between 1 and 31),
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.birthdays enable row level security;

create policy "Public read access"
  on public.birthdays
  for select
  to anon, authenticated
  using (true);
