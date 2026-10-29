-- Even Butter waitlist: people who want to hear when orders open.
-- The public site inserts rows with the anon key. Nobody but the dashboard
-- (service role) can read, change or delete them.

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 1 and 120),
  email       text not null check (
                char_length(email) <= 254
                and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
              ),
  created_at  timestamptz not null default now()
);

-- One row per address, case-insensitively.
create unique index if not exists waitlist_email_unique on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- Public visitors may add themselves, and nothing else.
create policy "anon can join the waitlist"
  on public.waitlist for insert
  to anon
  with check (true);

-- Belt and braces: anon never gets select/update/delete.
revoke all on public.waitlist from anon;
grant insert on public.waitlist to anon;
